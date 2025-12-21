from src.core.models.base import *


class LessonModel(BaseModel):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    course = models.ForeignKey('CourseModel', on_delete=models.SET_NULL, null=True, related_name='lessons')
    order = models.PositiveIntegerField()
    content = models.TextField()
    video_url = models.URLField(blank=True, null=True)
    

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    