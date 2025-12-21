from src.api.serializers.base import *


class QuizSerializer(BaseSerializer):
    # questions = QuestionSerializer(many=True, read_only=True)
    # answers = AnswerSerializer(many=True, read_only=True)
    class Meta:
        model = QuizModel
        fields = ['title', 
                  'lessons', 
                  'total_questions', 
                  'passing_score', 
                #   'questions', 
                #   'answers'
                  ]
    