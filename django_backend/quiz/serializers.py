from rest_framework import serializers
from .models import Quiz, Question


class Quiz_Serializer(serializers.Serializer):
    quiz_id = serializers.IntegerField()
    name = serializers.CharField()
    no_of_questions = serializers.SerializerMethodField()

    def get_no_of_questions(self, instance: "Quiz"):
        return len(instance.questions.all())


class Option_Serializer(serializers.Serializer):
    option_id = serializers.IntegerField()
    value = serializers.CharField()


class Question_Serializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    description = serializers.CharField()
    options = Option_Serializer(many=True)


class Question_Result_Serializer(serializers.Serializer):
    # add error handling
    question_id = serializers.IntegerField()
    correct_option_id = serializers.SerializerMethodField()
    chosen_option_id = serializers.SerializerMethodField()
    is_correct = serializers.SerializerMethodField()

    def get_correct_option_id(self, instance: "Question"):
        return instance.correct_option.option_id

    def get_chosen_option_id(self, instance: "Question"):
        chosen_options: "dict[str,int]" = self.context["chosen_options"]
        str_question_id = str(instance.question_id)
        return chosen_options[str_question_id]

    def get_is_correct(self, instance: "Question"):
        chosen_options: "dict[str,int]" = self.context["chosen_options"]
        str_question_id = str(instance.question_id)
        return chosen_options[str_question_id] == instance.correct_option.option_id
