from src.api.views.base import *


class CourseViewSet(BaseViewSet):
    queryset = CourseModel.objects.all()
    search_fields = ("title", "description")
    ordering_fields = ("created_at", "title")
    ordering = ("-created_at",)
    serializer_class = CourseSerializer

    # def get_serializer_class(self):
    #     if self.action == "retrieve":
    #         return CourseDetailSerializer
    #     return CourseSerializer
    
    @action(detail=True, methods=['get'], url_path='lessons')
    def lessons(self, request, pk=None):
        course = self.get_object()
        lessons = course.lessons.order_by('order')

        serializer = LessonSerializer(
            lessons, many=True, context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def enroll(self, request, pk=None):
        course = self.get_object()
        user = request.user

        # agar foydalanuvchi allaqachon enrolled bo'lsa
        if Enrollment.objects.filter(user=user, course=course).exists():
            return Response({"detail": "Already enrolled"}, status=status.HTTP_200_OK)

        Enrollment.objects.create(user=user, course=course)
        return Response({"detail": "Successfully enrolled"}, status=status.HTTP_201_CREATED)