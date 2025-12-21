from src.core.models.base import *


class QuizResultModel(BaseModel):
    user = models.ForeignKeyField( User, backref="quiz_results", on_delete="CASCADE",)
