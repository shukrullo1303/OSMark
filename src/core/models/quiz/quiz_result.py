from src.core.models.base import *


class QuizResultModel(BaseModel):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="quiz_results")
