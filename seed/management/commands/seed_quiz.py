import random
from django.core.management.base import BaseCommand
from faker import Faker
from django.contrib.auth.models import User
from src.core.models import QuizModel, QuestionModel, AnswerModel, QuizResultModel
# LessonModel ham kerak bo'ladi, uni ham import qiling

class Command(BaseCommand):
    help = "Seed database with fake Quiz data"

    def handle(self, *args, **kwargs):
        fake = Faker()
        self.stdout.write("Seeding data...")

        # 1. Userlarni tekshirish yoki yaratish
        users = User.objects.all()
        if not users.exists():
            for _ in range(5):
                User.objects.create_user(username=fake.user_name(), password='password123')
            users = User.objects.all()

        # 2. Quiz yaratish
        for _ in range(5):  # 5 ta Quiz
            quiz = QuizModel.objects.create(
                title=fake.sentence(nb_words=4),
                # lesson=... (agar darslar bo'lsa bittasini tanlang)
            )

            # 3. Savollar yaratish
            for _ in range(10):  # Har bir quiz uchun 10 ta savol
                question = QuestionModel.objects.create(
                    quiz=quiz,
                    text=fake.question() if hasattr(fake, 'question') else fake.sentence() + "?"
                )

                # 4. Javoblar yaratish
                correct_answer_index = random.randint(0, 3)
                for i in range(4):  # Har bir savolga 4 ta javob
                    AnswerModel.objects.create(
                        question=question,
                        text=fake.word() if i != correct_answer_index else "To'g'ri javob: " + fake.word(),
                        is_correct=(i == correct_answer_index)
                    )

            # 5. Quiz natijalarini (QuizResult) yaratish
            for user in users:
                if random.choice([True, False]): # Tasodifiy userlar yechgan bo'lsin
                    QuizResultModel.objects.get_or_create(
                        user=user,
                        quiz=quiz,
                        defaults={'score': random.uniform(0, 100)}
                    )

        self.stdout.write(self.style.SUCCESS("Successfully seeded Quiz data!"))