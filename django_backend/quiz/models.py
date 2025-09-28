from django.db import models

class Quiz(models.Model):
    pass

class Question(models.Model):
    part_of_quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    description = models.CharField()
    correct_option = models.OneToOneField("Option", on_delete=models.CASCADE, null=True, blank=True)

class Option(models.Model):
    part_of_question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="options")
    value = models.CharField()