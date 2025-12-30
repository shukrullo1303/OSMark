from src.api.serializers.base import *


class QuizSerializer(BaseSerializer):
    class Meta:
        model = QuizModel
        fields = ['title', 
                  'lesson', 
                  # 'total_questions', 
                  'passing_score', 
                #   'questions', 
                #   'answers'
                  ]
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['questions'] = QuestionSerializer(instance.questions, many=True).data
        return rep
