from django.http import HttpRequest, HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from .serializers import Quiz_Serializer, Question_Serializer, Question_Result_Serializer
from .models import Quiz
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework import status
import io
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt

json_parser = JSONParser()
json_renderer = JSONRenderer()


@require_GET
def get_all_quizzes(request: "HttpRequest") -> HttpResponse:
    quizzes = Quiz_Serializer(Quiz.objects.all().order_by("name"), many=True)
    response_data = json_renderer.render(quizzes.data)
    return HttpResponse(response_data, headers={"Content-type": "application/json"})


@require_GET
def get_quiz_info(request: "HttpRequest", quiz_id: "int") -> HttpResponse:
    quiz = Quiz.objects.filter(quiz_id=quiz_id).first()
    if quiz != None:
        quiz_s = Quiz_Serializer(quiz)
        response_data = json_renderer.render(quiz_s.data)
        return HttpResponse(response_data, headers={"Content-type": "application/json"})
    else:
        return HttpResponseBadRequest("This quiz does not exist.")


@require_POST
@csrf_exempt
def start_quiz_and_get_all_questions(request: "HttpRequest", quiz_id: "int") -> HttpResponse:
    quiz = Quiz.objects.filter(quiz_id=quiz_id).first()
    if quiz != None:
        questions = Question_Serializer(quiz.questions.filter(correct_option__isnull=False).all(), many=True)
        response_data = json_renderer.render(questions.data)
        quiz.has_started = True
        quiz.save()
        return HttpResponse(response_data, headers={"Content-type": "application/json"})

    else:
        return HttpResponseBadRequest("This quiz does not exist.")


@require_POST
@csrf_exempt
def submit_quiz_answers_and_get_result(request: "HttpRequest", quiz_id: "int") -> HttpResponse:
    if request.content_type == "application/json":
        quiz = Quiz.objects.filter(quiz_id=quiz_id).first()
        if quiz != None:
            chosen_options = json_parser.parse(io.BytesIO(request.body))
            question_results = Question_Result_Serializer(
                quiz.questions.filter(correct_option__isnull=False).all(), many=True, context={"chosen_options": chosen_options}
            )
            response_data = json_renderer.render(question_results.data)
            quiz.has_started = False
            quiz.save()
            return HttpResponse(response_data, headers={"Content-type": "application/json"})
        else:
            return HttpResponseBadRequest("This quiz does not exist.")
    else:
        return HttpResponse(content="JSON data expected.", status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, headers={"Accept-Post": "application/json"})
