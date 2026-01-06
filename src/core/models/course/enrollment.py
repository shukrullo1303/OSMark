from src.core.models.base import *


class EnrollmentModel(BaseModel):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey('CourseModel', on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(default=timezone.now)
    progress = models.DecimalField(max_digits=5, decimal_places=2, default=0.00) 
    is_paid = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, default=False)

    class Meta:
        unique_together = ('user', 'course')

    def __str__(self):
        return f"{self.user.username} enrolled in {self.course.title}"