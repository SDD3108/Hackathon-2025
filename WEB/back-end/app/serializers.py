from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, UserSerializer as BaseUserSerializer
from rest_framework import serializers
from .models import User, Group, Subject, Lecture, Schedule

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'password', 'name', 'surname', 'avatar', 'is_teacher', 'is_student', 'is_admin', 'group', 'username')
        extra_kwargs = {'username': {'required': False}}

    def create(self, validated_data):
        if not validated_data.get('username'):
            validated_data['username'] = validated_data['email']
        return super().create(validated_data)

class UserSerializer(BaseUserSerializer):
    group = serializers.StringRelatedField()
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'surname', 'avatar', 'is_teacher', 'is_student', 'is_admin', 'group')

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = '__all__' 



class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'


class LectureCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = ['id', 'subject', 'teacher', 'video']

from .models import Favorite

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'
