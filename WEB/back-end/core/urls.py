
from django.contrib import admin
from django.urls import path
from django.urls import include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from app.views import GroupViewSet, SubjectViewSet, LectureViewSet

router = DefaultRouter()
router.register(r'groups', GroupViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'lectures', LectureViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
