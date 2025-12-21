from src.api.serializers.base import *


class LessonSerializer(BaseSerializer):
    class Meta:
        model = LessonModel
        fields = '__all__'
    