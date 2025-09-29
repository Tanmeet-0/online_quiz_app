from django.urls import path
from quiz import views

urlpatterns = [
    path("", views.get_all_quizzes, name="home"),
    path("<int:quiz_id>/start", views.start_quiz, name="start"),
    path("<int:quiz_id>", views.get_all_questions_of_a_quiz, name="questions"),
    path("<int:quiz_id>/result", views.submit_quiz_answers_and_get_result, name="result"),
]
