from django.urls import path
from quiz import views

urlpatterns = [
    path("", views.get_all_quizzes, name="quizzes"),
    path("<int:quiz_id>", views.get_quiz_info, name="quiz"),
    path("<int:quiz_id>/start", views.start_quiz, name="start"),
    path("<int:quiz_id>/attempt", views.get_all_questions_of_a_quiz, name="attempt"),
    path("<int:quiz_id>/result", views.submit_quiz_answers_and_get_result, name="result"),
]
