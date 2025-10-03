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

export default function Quiz_Attempt({ loaderData }: Route.ComponentProps) {
    const quiz_context = useOutletContext<Quiz_Context>();

    const questions = loaderData.has_data
        ? loaderData.questions!.map((question) => {
              return <Question_C key={question.question_id} question={question} />;
          })
        : null;

    const [question_index, set_question_index] = useState(0);
    function previous_question() {
        set_question_index(question_index - 1);
    }

    function next_question() {
        set_question_index(question_index + 1);
    }

    return quiz_context.quiz != undefined && loaderData.has_data ? (
        <div className="questions">
            {questions![question_index]}

            <button className="question_change" onClick={previous_question} disabled={question_index == 0}>
                Previous Question
            </button>
            <button className="question_change" onClick={next_question} disabled={question_index == questions!.length - 1}>
                Next Question
            </button>

            {Object.keys(quiz_context.chosen_options).length == questions!.length ? (
                <Link to={get_pathname_to_quiz_result(quiz_context.quiz)} className="quiz_submit">
                    Submit Quiz
                </Link>
            ) : (
                ""
            )}
        </div>
    ) : (
        <div className="error">The Quiz Could Not Be Started</div>
    );
}

function Question_C({ question }: { question: Question }) {
    const quiz_context = useOutletContext<Quiz_Context>();

    return (
        <div>
            {question.description}

            {question.options.map((option) => {
                return (
                    <div>
                        <label key={option.option_id} className="option">
                            <input
                                className="option"
                                type="radio"
                                name="an_option"
                                value={option.option_id}
                                checked={
                                    Object.hasOwn(quiz_context.chosen_options, question.question_id)
                                        ? quiz_context.chosen_options[question.question_id] == option.option_id
                                        : false
                                }
                                onChange={(event) => {
                                    const new_chosen_options = { ...quiz_context.chosen_options };
                                    new_chosen_options[question.question_id] = parseInt(event.target.value);
                                    quiz_context.set_chosen_options(new_chosen_options);
                                }}
                            />
                            {option.value}
                        </label>
                    </div>
                );
            })}
        </div>
    );
}
