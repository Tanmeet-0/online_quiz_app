import type { Route } from "./+types/quiz_result";
import type { Quiz_Context } from "./quiz_layout";
import { useOutletContext } from "react-router";
import { useFetcher } from "react-router";
import type { Chosen_Options } from "../utils/api_types";
import { submit_quiz_answers_and_get_results } from "../utils/api";
import { useEffect, useState } from "react";
import type { Question_Result } from "../utils/api_types";
import { Link } from "react-router";
import { get_pathname_to_all_quizzes } from "../routes";

export default function Quiz_Result({}: Route.ComponentProps) {
    const fetcher = useFetcher<typeof clientAction>();
    const quiz_context = useOutletContext<Quiz_Context>();
    useEffect(() => {
        if (fetcher.data == undefined && fetcher.state == "idle" && quiz_context.quiz != undefined) {
            fetcher.submit(quiz_context.chosen_options_ref.current, {
                action: "",
                method: "POST",
                encType: "application/json",
            });
        }
    });

    const question_results =
        fetcher.data != undefined
            ? fetcher.data.has_data
                ? fetcher.data.question_results!.map((question_result) => {
                      return <Question_Result_C question_result={question_result} />;
                  })
                : null
            : null;

    const [question_result_index, set_question_result_index] = useState(0);
    function previous_question() {
        set_question_result_index(question_result_index - 1);
    }

    function next_question() {
        set_question_result_index(question_result_index + 1);
    }

    return (
        <div>
            {fetcher.data != undefined ? (
                fetcher.data.has_data ? (
                    <div>
                        Score:
                        {fetcher.data.question_results!.reduce((total_correct, question_result) => {
                            return question_result.is_correct ? total_correct + 1 : total_correct;
                        }, 0)}
                        /{quiz_context.quiz!.no_of_questions}
                        <br />
                        {question_results![question_result_index]}
                        <br />
                        <button id="previous_question" onClick={previous_question} disabled={question_result_index == 0}>
                            Previous Question
                        </button>
                        <button
                            id="next_question"
                            onClick={next_question}
                            disabled={question_result_index == question_results!.length - 1}
                        >
                            Next Question
                        </button>
                        <br />
                        <Link to={get_pathname_to_all_quizzes()}>Go To All Quizzes</Link>
                    </div>
                ) : (
                    "The Results Could Not Be Loaded"
                )
            ) : (
                "Loading Results..."
            )}
        </div>
    );
}

export async function clientAction({ params, request }: Route.ActionArgs) {
    try {
        const chosen_options: Chosen_Options = await request.json();
        const question_results = await submit_quiz_answers_and_get_results(params.quiz_id, chosen_options);
        return { question_results: question_results, has_data: true };
    } catch (error) {
        return { error: String(error), has_data: false };
    }
}

function Question_Result_C({ question_result }: { question_result: Question_Result }) {
    return (
        <div>
            {question_result.description}
            <br />
            {question_result.options.map((option) => {
                return (
                    <div>
                        {option.option_id == question_result.correct_option_id
                            ? `Correct -> ${option.value}`
                            : option.option_id == question_result.chosen_option_id
                              ? `You Chose -> ${option.value}`
                              : `${option.value}`}
                    </div>
                );
            })}
        </div>
    );
}
