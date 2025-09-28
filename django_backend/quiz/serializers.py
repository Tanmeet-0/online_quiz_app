from rest_framework import serializers
from .models import Quiz, Question


class QuizSerializer(serializers.Serializer):
    quiz_id = serializers.IntegerField()
    name = serializers.CharField()
    no_of_questions = serializers.SerializerMethodField()

    def get_no_of_questions(self, instance:"Quiz"):
        return len(instance.questions.all())


class QuestionSerializer(serializers.Serializer):
    description = serializers.CharField()
    options = serializers.SerializerMethodField()

    def get_options(self, instance:"Question"):
        return OptionSerializer(instance.options.all(), many=True).data


class OptionSerializer(serializers.Serializer):
    option_id = serializers.IntegerField()
    value = serializers.CharField()