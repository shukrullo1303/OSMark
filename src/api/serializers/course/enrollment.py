from core.models.course.enrollment import EnrollmentModel
from src.api.serializers.base import *


class EnrollmentSerializer(BaseModel):
    class Meta:
        model = EnrollmentModel
        fields = '__all__'
    