
from django.contrib import admin
from django.urls import path
from django.urls import include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from app.views import GroupViewSet, SubjectViewSet, LectureViewSet, ScheduleViewSet, UserView, FavoriteViewSet, LectureCreateView, TimePointViewSet
# LectureCreateView

router = DefaultRouter()
router.register(r'groups', GroupViewSet, basename='group')
router.register(r'subjects', SubjectViewSet, basename='subject')
router.register(r'lectures', LectureViewSet, basename='lecture')
router.register(r'schedules', ScheduleViewSet, basename='schedule')
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'users', UserView, basename='user')
router.register(r'timepoints', TimePointViewSet, basename='timepoint')



urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('api/lectures/create/', LectureCreateView.as_view(), name='lecture-create'),

    path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

