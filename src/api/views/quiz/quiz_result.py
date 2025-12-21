from src.api.views.base import * 


class QuizResultViewSet(BaseViewSet):
    queryset = QuizResultModel.objects.all()
    serializer_class = QuizResultSerializer
    