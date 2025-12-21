from src.api.views.base import *


class CourseViewSet(BaseViewSet):
    queryset = CourseModel.objects.all()
    serializer_class = CourseSerializer
    search_fields = ("title", "description")
    ordering_fields = ("created_at", "title")
    ordering = ("-created_at",)