from django.http import HttpRequest, HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from .serializers import Quiz_Serializer, Question_Serializer, Question_Result_Serializer
from .models import Quiz, Question, Option
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework import status
import io


json_parser = JSONParser()
json_renderer = JSONRenderer()


def get_all_quizzes(request: "HttpRequest") -> HttpResponse:
    if request.method == "GET":
        quizzes = Quiz_Serializer(Quiz.objects.all().order_by("name"), many=True)
        response_data = json_renderer.render(quizzes.data)
        return HttpResponse(response_data, headers={"Content-type": "application/json"})
    else:
        return HttpResponseNotAllowed(permitted_methods=["GET"])


def start_quiz(request: "HttpRequest", quiz_id: "int") -> HttpResponse:
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


def get_all_questions_of_a_quiz(request: "HttpRequest", quiz_id: "int") -> HttpResponse:
    if request.method == "GET":
        quiz = Quiz.objects.filter(quiz_id=quiz_id).first()
        if quiz != None:
            if quiz.has_started:
                questions = Question_Serializer(quiz.questions.all(), many=True)
                response_data = json_renderer.render(questions.data)
                return HttpResponse(response_data, headers={"Content-type": "application/json"})
            else:
                return HttpResponseBadRequest("The quiz has not started.")
        else:
            return HttpResponseBadRequest("This quiz does not exist.")
    else:
        return HttpResponseNotAllowed(permitted_methods=["GET"])


def submit_quiz_answers_and_get_result(request: "HttpRequest", quiz_id: "int") -> HttpResponse:
    if request.method == "POST":
        if request.content_type == "application/json":
            quiz = Quiz.objects.filter(quiz_id=quiz_id).first()
            if quiz != None:
                if quiz.has_started:
                    chosen_options = json_parser.parse(io.BytesIO(request.body))
                    question_results = Question_Result_Serializer(quiz.questions.all(), many=True, context={"chosen_options": chosen_options})
                    response_data = json_renderer.render(question_results.data)
                    quiz.has_started = False
                    quiz.save()
                    return HttpResponse(response_data, headers={"Content-type": "application/json"})
                else:
                    return HttpResponseBadRequest("The quiz has not started.")
            else:
                return HttpResponseBadRequest("This quiz does not exist.")
        else:
            return HttpResponse(content="JSON data expected.", status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)
    else:
        return HttpResponseNotAllowed(permitted_methods=["POST"])
