from django.urls import path
from quiz import views

urlpatterns = [
    path("", views.get_all_quizzes),
    path("<int:quiz_id>", views.get_all_questions_of_a_quiz),
]
