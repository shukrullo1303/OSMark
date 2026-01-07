from src.api.serializers.base import *
from src.api.serializers.quiz.quiz import QuizSerializer

class LessonSerializer(BaseSerializer):
    is_locked = serializers.SerializerMethodField()
    # quizzes = QuizSerializer(many=True)
    next_lesson_id = serializers.SerializerMethodField()
    prev_lesson_id = serializers.SerializerMethodField()

    class Meta:
        model = LessonModel
        fields = ['id', 'title', 'order', 'video_url', 
                  'is_locked', 'course_id', 'created_at', 'updated_at', 
                  'quizzes', 'next_lesson_id', "prev_lesson_id"]

    def get_is_locked(self, lesson):
        request = self.context['request']
        return not can_user_open_lesson(request.user, lesson)


    def get_next_lesson_id(self, lesson):
        next_lesson = LessonModel.objects.filter(
            course_id=lesson.course_id,
            order__gt=lesson.order
        ).order_by('order').first()

        return next_lesson.id if next_lesson else None


    def get_prev_lesson_id(self, lesson):
        prev_lesson = LessonModel.objects.filter(
            course_id=lesson.course_id,
            order__lt=lesson.order
        ).order_by('-order').first()

        return prev_lesson.id if prev_lesson else None

    
    
