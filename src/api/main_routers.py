from django.urls import include, path

urlpatterns = [
    path("courses/", include("src.api.urls.course")),
    path("lessons/", include("src.api.urls.lesson")),
    path("quiz/", include("src.api.urls.quiz")),
    path("", include("src.api.urls.swagger"))
]
