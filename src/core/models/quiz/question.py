from src.core.models.base import *


class QuestionModel(BaseModel):
    text = models.TextField()
    quiz = models.ForeignKeyField("QuizModel", backref="questions", on_delete=models.CASCADE)

    def __str__(self):
        return self.text