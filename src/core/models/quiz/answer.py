from src.core.models.base import *


class AnswerModel(BaseModel):
    text = models.TextField()
    question = models.ForeignKeyField("QuestionModel", backref="answers", on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text