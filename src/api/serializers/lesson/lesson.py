from src.api.serializers.base import *


class LessonSerializer(BaseSerializer):
    is_locked = serializers.SerializerMethodField()
    class Meta:
        model = LessonModel
        fields = ['id', 'title', 'order', 'video_url', 'is_locked', "course_id"]

    # def get_is_locked(self, lesson):
    #     user = self.context['request'].user
    #     return not can_user_open_lesson(user, lesson)

    def get_is_locked(self, lesson):
        request = self.context['request']
        return not can_user_open_lesson(request.user, lesson)
