from src.api.views.base import *


class LessonViewSet(BaseViewSet):
    queryset = LessonModel.objects.all()
    serializer_class = LessonSerializer
    search_fields = ("title", "description")
    ordering_fields = ("created_at", "title")
    ordering = ("-created_at",)

    def retrieve(self, request, *args, **kwargs):
        lesson = self.get_object()

        if not can_user_open_lesson(request.user, lesson):
            return Response(
                {"detail": "Avvalgi darsni tugating yoki kursni sotib oling"},
                status=403
            )
        
        return super().retrieve(request, *args, **kwargs)
    
    
    @action(detail=True, methods=['get'], url_path='quiz')
    def quiz(self, request, pk=None):
        lesson = self.get_object()
        # lesson bilan bog‘liq quizlarni olish
        quiz = lesson.quizzes.all()  # agar ForeignKey orqali bog‘langan bo‘lsa

        serializer = QuizSerializer(
            quiz,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)
    
