from src.api.serializers.base import *


class CourseSerializer(BaseSerializer):
    class Meta:
        model = CourseModel
        fields = '__all__'