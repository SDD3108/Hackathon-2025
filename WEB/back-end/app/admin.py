from django.contrib import admin
from .models import User, Group, Subject, Lecture, Schedule, Src

admin.site.register(User)
admin.site.register(Group)
admin.site.register(Subject)
admin.site.register(Lecture)
admin.site.register(Schedule)
admin.site.register(Src)