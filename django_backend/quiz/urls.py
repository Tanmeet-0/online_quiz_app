from django.urls import path
from quiz import views

urlpatterns = [
    path("", views.get_all_quizzes, name="quizzes"),
    path("/<int:quiz_id>", views.get_quiz_info, name="quiz"),
    path("/<int:quiz_id>/start", views.start_quiz_and_get_all_questions, name="start"),
    path("/<int:quiz_id>/end", views.submit_quiz_answers_and_get_result, name="end"),
]
