from django.shortcuts import render
from rest_framework import viewsets
from .models import Group, Subject, Lecture
from .serializers import GroupSerializer, SubjectSerializer, LectureSerializer

# Create your views here.

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class LectureViewSet(viewsets.ModelViewSet):
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer
