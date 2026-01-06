from src.api.views.base import *


class QuizViewSet(BaseViewSet):
    queryset = QuizModel.objects.all()
    serializer_class = QuizSerializer

    @action(detail=True, methods=['post'], url_path='submit', permission_classes=[IsAuthenticated])
    def submit(self, request, pk=None):
        quiz = self.get_object()
        answers = request.data.get('answers', {})
        user = request.user

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

        # 🔹 DATABASEGA SAQLASH
        quiz_result, created = QuizResultModel.objects.update_or_create(
            user=user,
            quiz=quiz,
            defaults={'score': score}
        )

        return Response({
            "score": score,
            "correct_answers": correct,
            "total_questions": total,
            "passing_score": float(quiz.passing_score or 70),
            "result_id": quiz_result.id,
            "created": created
        })
    
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def user_results(self, request, pk=None):
        quiz = self.get_object()
        results = quiz.results.filter(user=request.user)  # faqat current user
        serializer = QuizResultSerializer(results, many=True)
        return Response(serializer.data)