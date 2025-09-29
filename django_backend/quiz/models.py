from django.db import models


class Quiz(models.Model):
    quiz_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    questions: "models.QuerySet[Question]"
    has_started = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Quizzes"

    def __str__(self):
        return self.name


class Question(models.Model):
    question_id = models.AutoField(primary_key=True)
    part_of_quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    description = models.CharField(max_length=200)
    options: "models.QuerySet[Option]"
    correct_option: "models.OneToOneField[Option | None]"
    correct_option = models.OneToOneField("Option", on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.description


class Option(models.Model):
    option_id = models.AutoField(primary_key=True)
    part_of_question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="options")
    value = models.CharField(max_length=80)

    def __str__(self):
        return self.value
