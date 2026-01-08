from django.urls import include, path
from src.api.views.utils import course_progress

urlpatterns = [
    path("courses/", include("src.api.urls.course")),
    path("lessons/", include("src.api.urls.lesson")),
    path("quiz/", include("src.api.urls.quiz")),
    path('quiz_result/', include('src.api.urls.quiz_result')),
    path("", include("src.api.urls.swagger")),
    path("auth/", include("src.api.urls.auth")),
    path('enrollments/', include('src.api.urls.enrollment')),
    path('lesson-progress/', include('src.api.urls.lesson_progress')),
    path('course-progress/', course_progress, name='course-progress'),
]
