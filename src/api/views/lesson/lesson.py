from src.api.views.base import *


class LessonViewSet(BaseViewSet):
    queryset = LessonModel.objects.all()
    serializer_class = LessonSerializer
    search_fields = ("title", "description")
    ordering_fields = ("created_at", "title")
    ordering = ("-created_at",)
