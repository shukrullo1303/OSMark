from src.api.views.base import *

class CertificateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        user = request.user
        # tekshirish: kurs 100% tugallanganmi
        lessons = LessonProgressModel.objects.filter(user=user, lesson__course_id=course_id)
        if lessons.exists() and lessons.filter(completed=False).count() == 0:
            # PDF yaratish
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="certificate_{course_id}.pdf"'
            p = canvas.Canvas(response)
            p.drawString(100, 750, f"Certificate of Completion")
            p.drawString(100, 700, f"Student: {user.username}")
            p.drawString(100, 650, f"Course ID: {course_id}")
            p.showPage()
            p.save()
            return response
        return Response({'error': 'Course not completed yet.'}, status=400)