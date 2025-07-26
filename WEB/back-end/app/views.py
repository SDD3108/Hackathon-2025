# views.py
import os 
from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import Group, Subject, Lecture, Schedule, User, TimePoint, Favorite
from .serializers import (
    GroupSerializer,
    SubjectSerializer,
    LectureSerializer,
    ScheduleSerializer,
    UserSerializer,
    # LectureCreateSerializer,
    FavoriteSerializer,
    TimePointSerializer
)
# from .vertex_ai import analyze_lecture_video, upload_to_gcs
from decouple import config
import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = config('VERTEX_SERVICE_ACCOUNT_FILE')

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class TimePointViewSet(viewsets.ModelViewSet):
    queryset = TimePoint.objects.all()
    serializer_class = TimePointSerializer



class LectureViewSet(viewsets.ModelViewSet):
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer
    parser_classes = [MultiPartParser, FormParser]  # <— чтобы можно было загружать видео

    # фильтрация по query параметрам: ?subject=1&teacher=5


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['subject__name', 'group__name', 'lecture__title']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        subject_id = self.request.query_params.get('subject')
        group_id = self.request.query_params.get('group')
        lecture_id = self.request.query_params.get('lecture')

        if subject_id:
            queryset = queryset.filter(subject__id=subject_id)

        if group_id:
            queryset = queryset.filter(group__id=group_id)

        if lecture_id:
            queryset = queryset.filter(lecture__id=lecture_id)

        return queryset


class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user')
        lecture_id = self.request.query_params.get('lecture')
        if user_id:
            queryset = queryset.filter(user__id=user_id)
        if lecture_id:
            queryset = queryset.filter(lecture__id=lecture_id)
        return queryset


import google.generativeai as genai
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from google.cloud import storage
import uuid

# Импорт моделей Django
from .models import Lecture, TimePoint, Schedule, User, Subject, Group

# --- Настройка Google Gemini API ---
# Используйте переменные окружения для безопасного хранения ключей
# api_key = os.getenv('GEMINI_API_KEY')
api_key = 'AIzaSyDS5cyaLf35kxxRhH-vL_OIFu1J9A29KHk'
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.5-flash")


# --- Настройка Google Cloud Storage ---
GCS_BUCKET_NAME = "lecture-videos-bucket"
storage_client = storage.Client()
bucket = storage_client.bucket(GCS_BUCKET_NAME)

class LectureCreateView(APIView):
    """
    Принимает видеофайл, загружает его в GCS, анализирует с помощью Gemini API,
    и сохраняет транскрипцию и расписание в базу данных.
    """
    parser_classes = (MultiPartParser, FormParser)
    def get(self, request, *args, **kwargs):
        """
        Возвращает список всех лекций (или можно реализовать другую логику по необходимости).
        """
        lectures = Lecture.objects.all()
        data = []
        for lecture in lectures:
            data.append({
                "id": lecture.id,
                "title": lecture.title,
                "teacher": lecture.teacher.email if lecture.teacher else None,
                "lecture_text": lecture.lecture_text,
                "video": lecture.video.url if lecture.video else None,
                "created_at": lecture.created_at,
            })
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        video_file = request.data.get('video')
        user_id = request.data.get('user_id')
        date = request.data.get('date')  # Ожидаем дату в формате YYYY-MM-DD
        group_id = request.data.get('group_id')
        is_double_str = request.data.get('is_double')
        is_double = True if is_double_str == 'true' else False

        if not all([video_file, user_id, date, group_id]):
            return Response(
                {"error": "Файл 'video', 'user_id', 'date' и 'group_id' обязательны."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Получение объектов User, Group
            teacher = User.objects.get(id=user_id, is_teacher=True)
            group = Group.objects.get(id=group_id)

            print(video_file)

            # 1. Загрузка файла в GCS
            file_name = f"videos/{uuid.uuid4()}_{video_file}"
            blob = bucket.blob(file_name)
            
            print(f"Загрузка файла '{video_file}' в GCS...")
            blob.upload_from_file(video_file, content_type='video/mp4')
            
            # Получаем публичный URL файла в GCS
            video_url = f"https://storage.googleapis.com/{GCS_BUCKET_NAME}/{file_name}"
            print(f"Файл успешно загружен. URL: {video_url}")

            # 2. Формируем промпт для Gemini
            prompt = f"""
# Analyze this full lecture video and provide:
# 1. A suitable title for the lecture (max 100 characters)
# 2. A complete transcription of the lecture
# 3. Time points in the format: MM:SS Description
# Return the response in JSON format.
# Video path: {video_url}
# """
            
            # 3. Отправляем запрос в Gemini
            print("Генерация контента из видео...")
            response = model.generate_content(
                contents=[prompt],
                generation_config={"response_mime_type": "application/json"}
            )
            
            json_response = json.loads(response.text)
            
            # 4. Сохранение данных в БД
            title = json_response.get('title', 'Без названия')
            transcription = json_response.get('transcription', '')
            time_points_data = json_response.get('time_points', [])

            # Создание новой записи о лекции
            lecture = Lecture.objects.create(
                title=title,
                teacher=teacher,
                lecture_text=transcription,
                video=video_file  # Сохраняем файл в поле FileField
            )
            
            # Создание временных меток
            for time_point_str in time_points_data:
                try:
                    time_str, description = time_point_str.split(' ', 1)
                    TimePoint.objects.create(
                        lecture=lecture,
                        time=time_str.strip(),
                        name=description.strip()
                    )
                except ValueError:
                    print(f"Пропущена некорректная временная метка: {time_point_str}")

            # 5. Сохранение расписания
            schedule_entry = Schedule.objects.create(
                group=group,
                lecture=lecture,
                date=date,  # Сохраняем дату, переданную в запросе
                is_double=is_double  # Сохраняем is_double
            )

            # Возвращаем успешный ответ
            return Response(
                {
                    "message": "Видео успешно загружено, проанализировано и сохранено в БД.",
                    "lecture_id": lecture.id,
                    "schedule_id": schedule_entry.id
                },
                status=status.HTTP_201_CREATED
            )

        except User.DoesNotExist:
            return Response(
                {"error": f"Преподаватель с ID {user_id} не найден или не является преподавателем."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Group.DoesNotExist:
            return Response(
                {"error": f"Группа с ID {group_id} не найдена."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Произошла ошибка: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )