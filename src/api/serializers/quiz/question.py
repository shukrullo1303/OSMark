from src.api.serializers.base import * 


class QuestionSerializer(BaseSerializer):
    class Meta:
        model = QuestionModel
        fields = '__all__'
    