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


class Subject(models.Model):
    name = models.CharField(max_length=100)
    class_room = models.CharField(max_length=255)


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
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='users', null=True)


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email








class Lecture(models.Model):
    title = models.TextField()
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'is_teacher': True}, related_name='lectures')
    lecture_text = models.TextField()
    video = models.URLField(blank=True, null=True)
    created_at = models.DateField(auto_now_add=True)


    def __str__(self):
        return f"{self.title} - {self.created_at}"
    class Meta:
        ordering = ['-created_at']


class TimePoint(models.Model):
    name = models.CharField(max_length=255)  # Например: "Started topic"
    time = models.CharField(max_length=10)
    lecture = models.ForeignKey('Lecture', on_delete=models.CASCADE, related_name='timepoints')

    def __str__(self):
        return f"Time point {self.name} for Lecture {self.lecture.id}"



class Schedule(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='schedule_entries',default=1)
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE, related_name='schedule_entries')
    is_double = models.BooleanField(default=False)
    date = models.DateField(auto_now_add=True)


    def get_dayOfWeek_display(self):
        # Mimic Django's get_FOO_display for custom CharField with choices
        return dict(self.DAYS_OF_WEEK).get(self.dayOfWeek, self.dayOfWeek)

    def __str__(self):
        return f'{self.subject.name} - {self.group.name} - {self.get_dayOfWeek_display()}'


class Favorite(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='favorite')
    lecture = models.ForeignKey('Lecture', on_delete=models.CASCADE, related_name='favorited_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'lecture')
        verbose_name = 'Favorite Lecture'
        verbose_name_plural = 'Favorite Lectures'

    def __str__(self):
        return f"{self.user.email} - {self.lecture.title}"

class Keyword(models.Model):
    start_index= models.IntegerField()
    end_index= models.IntegerField()
    lecture = models.ForeignKey('Lecture', on_delete=models.CASCADE, related_name='keyword')
