from src.api.urls.base import *

router = DefaultRouter()
router.register('quiz', QuizViewSet, basename='')
router.register('quiz_result', QuizResultViewSet, basename='quiz_result')

urlpatterns = router.urls
