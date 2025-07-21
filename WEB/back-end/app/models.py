from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from PIL import Image

class Group(models.Model):
    name = models.CharField(max_length=255)
    garde = models.CharField(max_length=255)
    # subjects = models.ManyToManyField('Subject', related_name='groups', blank=True)  # Удалено

    def __str__(self):
        return self.name

class User(AbstractUser):
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    email = models.EmailField(unique=True)
    is_teacher = models.BooleanField(default=False)
    is_student = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    group = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class Subject(models.Model):
    title = models.CharField(max_length=255)
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'is_teacher': True}, related_name='subjects')
    groups = models.ManyToManyField(Group, related_name='subjects_in_group', blank=True)

    def __str__(self):
        return self.title

class Lecture(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='lectures')
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'is_teacher': True}, related_name='lectures')
    lecture_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject.title} - {self.created_at}"
