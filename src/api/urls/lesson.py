from src.api.urls.base import * 

router = DefaultRouter()
router.register("", LessonViewSet, basename="lesson")
router.register("lesson_progress", LessonProgressViewSet, basename="lesson_progress")
urlpatterns = router.urls
