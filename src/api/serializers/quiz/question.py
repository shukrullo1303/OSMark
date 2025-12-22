from src.api.serializers.base import * 


class QuestionSerializer(BaseSerializer):
    class Meta:
        model = QuestionModel
        fields = '__all__'
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['answers'] = AnswerSerializer(instance.answers, many=True).data
        return rep
