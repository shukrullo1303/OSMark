from src.api.serializers.base import *


class CourseSerializer(BaseModel):
    class Meta:
        model = CourseModel
        fields = '__all__'