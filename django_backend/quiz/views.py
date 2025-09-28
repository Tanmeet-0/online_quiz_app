from django.http import HttpRequest, HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from .serializers import QuizSerializer, QuestionSerializer
from .models import Quiz, Question, Option
from rest_framework.renderers import JSONRenderer

json_renderer = JSONRenderer()

def get_all_quizzes(request:"HttpRequest") -> HttpResponse:
    if request.method == "GET":
        quizzes = QuizSerializer(Quiz.objects.all().order_by("name"), many=True) 
        response_data = json_renderer.render(quizzes.data)
        return HttpResponse(response_data, headers={"Content-type":"application/json"})
    else:
        return HttpResponseNotAllowed(permitted_methods=["GET"])

def start_quiz(request:"HttpRequest", quiz_id:"int") -> HttpResponse:
    if request.method == "GET":
        quiz = Quiz.objects.filter(quiz_id=quiz_id).first()
        if quiz != None:
            if not quiz.has_started:
                quiz.has_started = True
                quiz.save()
                return HttpResponse("The quiz has started.")
            else:
                return HttpResponseBadRequest("This quiz has already started.")
        else:
            return HttpResponseBadRequest("This quiz does not exist.")
    else:
        return HttpResponseNotAllowed(permitted_methods=["GET"])


def get_all_questions_of_a_quiz(request:"HttpRequest", quiz_id:"int") -> HttpResponse:
    if request.method == "GET":
        quiz = Quiz.objects.filter(quiz_id=quiz_id).first()
        if quiz != None:
            if quiz.has_started:
                questions = QuestionSerializer(quiz.questions.all(), many=True)
                response_data = json_renderer.render(questions.data)
                return HttpResponse(response_data, headers={"Content-type":"application/json"})
            else:
                return HttpResponseBadRequest("The quiz has not started.")
        else:
            return HttpResponseBadRequest("This quiz does not exist.")
    else:
        return HttpResponseNotAllowed(permitted_methods=["GET"])
    