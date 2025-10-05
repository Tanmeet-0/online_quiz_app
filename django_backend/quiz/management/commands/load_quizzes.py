from django.core.management.base import BaseCommand, CommandError, CommandParser
from django.db import transaction
from quiz.models import Quiz, Question, Option
import json


class Command(BaseCommand):
    help = "Loads quizzes from a json file into the database"
    missing_args_message = "Provide either the relative path of the json file with respect to manage.py or the absolute path to the file."

    JSON_FILE_ARGUMENT_NAME = "json_file_path"

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            self.JSON_FILE_ARGUMENT_NAME,
            type=str,
            help="Either the relative path of the json file with respect to manage.py or the absolute path to the file.",
        )

    def handle(self, *args, **options) -> str | None:
        try:
            json_file = open(options[self.JSON_FILE_ARGUMENT_NAME], "r")
        except FileNotFoundError:
            raise CommandError(f'No file found at "{options[self.JSON_FILE_ARGUMENT_NAME]}".')
        except Exception:
            raise CommandError(f'Unable to access file at "{options[self.JSON_FILE_ARGUMENT_NAME]}".')
        
        try:
            with transaction.atomic():
                quizzes_data = json.load(json_file)
                json_file.close()
                for quiz_data in quizzes_data:
                    new_quiz = Quiz()
                    new_quiz.name = quiz_data["name"]
                    new_quiz.save()
                    for question_data in quiz_data["questions"]:
                        new_question = Question()
                        new_question.description = question_data["description"]
                        new_question.part_of_quiz = new_quiz
                        new_question.save()
                        for option_data in question_data["options"]:
                            new_option = Option()
                            new_option.value = option_data["value"]
                            new_option.part_of_question = new_question
                            new_option.save()
                            if option_data["is_answer"]:
                                if new_question.correct_option == None:
                                    new_question.correct_option = new_option
                                    new_question.save()
                                else:
                                    # a question can only have a correct answer
                                    raise Exception()
                        if len(new_question.options.all()) < 2:
                            # each question must have at least 2 options
                            raise Exception()
                        if new_question.correct_option == None:
                            # a question must have a correct answer
                            raise Exception()
                    if len(new_quiz.questions.all()) < 1:
                        # each quiz must have at least 1 question
                        raise Exception()

            return self.style.SUCCESS("Successfully loaded quizzes from file into the database.")
        except Exception:
            json_file.close()
            return self.style.ERROR("Failed to load quizzes from file into the database.")
