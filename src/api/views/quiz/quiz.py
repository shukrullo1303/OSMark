from src.api.views.base import *


class QuizViewSet(BaseViewSet):
    queryset = QuizModel.objects.all()
    serializer_class = QuizSerializer
    search_fields = ("title", "description")
    ordering_fields = ("created_at", "title")
    ordering = ("-created_at",)

    @action(detail=True, methods=['post'], url_path='submit', permission_classes=[IsAuthenticated])
    def submit(self, request, pk=None):
        """
        Frontenddan answers olib, score va correct answers qaytaradi.
        """
        quiz = self.get_object()
        answers = request.data.get('answers', {})

        if not isinstance(answers, dict):
            return Response({"detail": "Invalid data format."}, status=400)

        correct = 0
        total = quiz.questions.count()

        for question in quiz.questions.all():
            selected_id = answers.get(str(question.id)) or answers.get(question.id)
            if not selected_id:
                continue

            correct_answer = question.answers.filter(is_correct=True).first()
            if correct_answer and int(selected_id) == correct_answer.id:
                correct += 1

        score = round((correct / total) * 100, 2) if total else 0

        return Response({
            "score": score,
            "correct_answers": correct,
            "total_questions": total,
            "passing_score": float(quiz.passing_score or 70),
        }, status=200)