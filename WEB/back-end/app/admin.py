from django.contrib import admin
from .models import User, Group, Subject, Lecture

admin.site.register(User)
admin.site.register(Group)
admin.site.register(Subject)
admin.site.register(Lecture)
