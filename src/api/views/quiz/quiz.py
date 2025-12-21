from src.api.views.base import *


class QuizViewSet(BaseViewSet):
    queryset = QuizModel.objects.all()
    serializer_class = QuizSerializer
    search_fields = ("title", "description")
    ordering_fields = ("created_at", "title")
    ordering = ("-created_at",)
    