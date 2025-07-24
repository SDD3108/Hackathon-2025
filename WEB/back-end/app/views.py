# views.py

from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Group, Subject, Lecture, Schedule, User
from .serializers import GroupSerializer, SubjectSerializer, LectureSerializer, ScheduleSerializer, UserSerializer

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



