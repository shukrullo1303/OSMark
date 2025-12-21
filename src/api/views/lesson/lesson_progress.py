from src.api.views.base import *


class LessonProgressViewSet(BaseViewSet):
    """
    ViewSet for managing lesson progress.
    """
    queryset = LessonProgressModel.objects.all()
    serializer_class = LessonProgressSerializer


    def get_queryset(self):
        """
        Optionally restricts the returned lesson progress to a given user,
        by filtering against a `user_id` query parameter in the URL.
        """
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user_id')
        if user_id is not None:
            queryset = queryset.filter(user__id=user_id)
        return queryset