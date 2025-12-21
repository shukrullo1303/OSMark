from src.api.serializers.base import *


class QuizSerializer(BaseSerializer):
    class Meta:
        model = QuizModel
        fields = '__all__'