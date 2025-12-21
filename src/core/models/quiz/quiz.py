from src.core.models.base import *


class QuizModel(BaseModel):
    title = models.CharField(max_length=255)
    lesson = models.ForeignKey('lesson.LessonModel', on_delete=models.CASCADE, related_name='quizzes')
    total_questions = models.PositiveIntegerField()
    passing_score = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.title
