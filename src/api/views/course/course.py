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

        enrollment, created = EnrollmentModel.objects.get_or_create(
            user=user,
            course=course
        )

        if not created:
            return Response({"detail": "Already enrolled"})

        return Response({"detail": "Successfully enrolled"})
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated], url_path='is-enrolled')
    def is_enrolled(self, request, pk=None):
        course = self.get_object()
        user = request.user
        enrolled = EnrollmentModel.objects.filter(user=user, course=course).exists()
        return Response({"enrolled": enrolled})