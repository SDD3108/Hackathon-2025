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
    LectureCreateSerializer,
    FavoriteSerializer,
)
from .vertex_ai import analyze_lecture_video, upload_to_gcs
from decouple import config


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class LectureViewSet(viewsets.ModelViewSet):
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer
    parser_classes = [MultiPartParser, FormParser]  # <— чтобы можно было загружать видео

    # фильтрация по query параметрам: ?subject=1&teacher=5
    def get_queryset(self):
        queryset = super().get_queryset()
        subject_id = self.request.query_params.get('subject')
        teacher_id = self.request.query_params.get('teacher')
        group_id = self.request.query_params.get('group')

        if subject_id:
            queryset = queryset.filter(subject__id=subject_id)
        if teacher_id:
            queryset = queryset.filter(teacher__id=teacher_id)
        if group_id:
            queryset = queryset.filter(subject__schedule_entries__group__id=group_id).distinct()

        return queryset

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


class LectureCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LectureCreateSerializer(data=request.data)
        if serializer.is_valid():
            lecture = serializer.save()

            # Загружаем файл в GCS
            local_path = lecture.video.path
            filename = os.path.basename(local_path)
            gcs_uri = upload_to_gcs(local_path, config("VERTEX_BUCKET"), f"videos/{filename}")

            # Запускаем анализ
            try:
                analysis_result = analyze_lecture_video(gcs_uri)

                lecture.title = analysis_result['title']
                lecture.lecture_text = analysis_result['transcript']
                lecture.save()

                for point in analysis_result['timepoints']:
                    TimePoint.objects.create(
                        name=point.get("name", 0),
                        time=point.get("time", ""),
                        lecture=lecture
                    )

                return Response({'message': 'Lecture analyzed and saved'}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)