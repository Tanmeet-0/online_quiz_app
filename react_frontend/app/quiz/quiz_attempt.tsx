import type { Route } from "./+types/quiz_attempt";
import { start_quiz_and_get_quiz_questions } from "../utils/api";
import type { Question } from "../utils/api_types";
import { useState } from "react";
import { useOutletContext, Link } from "react-router";
import type { Quiz_Context } from "./quiz_layout";
import { get_pathname_to_quiz_result } from "../routes";

export async function clientLoader({ params }: Route.LoaderArgs) {
    try {
        const questions = await start_quiz_and_get_quiz_questions(params.quiz_id);
        return { questions: questions, has_data: true };
    } catch (error) {
        return { error: String(error), has_data: false };
    }
}

type Choose_Option_For_Question = (question_id: number, option_id: number) => void;

export default function Quiz_Attempt({ loaderData }: Route.ComponentProps) {
    const [force_update_value, force_update] = useState(true);
    const quiz_context = useOutletContext<Quiz_Context>();

    const choose_option_for_question: Choose_Option_For_Question = function (question_id: number, option_id: number) {
        quiz_context.chosen_options_ref.current[question_id] = option_id;
        force_update(!force_update_value);
    };

    const questions = loaderData.has_data
        ? loaderData.questions!.map((question) => {
              return (
                  <Question_C
                      key={question.question_id}
                      question={question}
                      choose_option_for_question={choose_option_for_question}
                  />
              );
          })
        : null;

    const [question_index, set_question_index] = useState(0);
    function previous_question() {
        set_question_index(question_index - 1);
    }

    function next_question() {
        set_question_index(question_index + 1);
    }

    return (
        <div>
            {quiz_context.quiz != undefined && loaderData.has_data ? (
                <div>
                    {questions![question_index]}
                    <br />
                    <button id="previous_question" onClick={previous_question} disabled={question_index == 0}>
                        Previous Question
                    </button>
                    <button id="next_question" onClick={next_question} disabled={question_index == questions!.length - 1}>
                        Next Question
                    </button>
                    <br />
                    {Object.keys(quiz_context.chosen_options_ref.current).length == questions!.length ? (
                        <Link to={get_pathname_to_quiz_result(quiz_context.quiz)}>Submit Quiz</Link>
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                "The Quiz Could Not Be Loaded."
            )}
        </div>
    );
}

function Question_C({
    question,
    choose_option_for_question,
}: {
    question: Question;
    choose_option_for_question: Choose_Option_For_Question;
}) {
    return (
        <div>
            {question.description}
            <select
                onChange={(event) => {
                    choose_option_for_question(question.question_id, parseInt(event.target.value));
                }}
            >
                <option hidden disabled selected></option>
                {question.options.map((option) => {
                    return (
                        <option key={option.option_id} value={option.option_id}>
                            {option.value}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}
