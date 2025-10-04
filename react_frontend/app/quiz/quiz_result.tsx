import type { Route } from "./+types/quiz_result";
import type { Quiz_Context } from "./quiz_layout";
import { useOutletContext, useFetcher } from "react-router";
import type { Chosen_Options, Option } from "../utils/api_types";
import { submit_quiz_answers_and_get_results } from "../utils/api";
import { useEffect, useState, useRef } from "react";
import type { Question_Result } from "../utils/api_types";
import { Link } from "react-router";
import { get_pathname_to_all_quizzes } from "../routes";

export async function clientAction({ params, request }: Route.ActionArgs) {
    try {
        const chosen_options: Chosen_Options = await request.json();
        const question_results = await submit_quiz_answers_and_get_results(params.quiz_id, chosen_options);
        return { question_results: question_results, has_data: true };
    } catch (error) {
        return { error: String(error), has_data: false };
    }
}

export default function Quiz_Result({}: Route.ComponentProps) {
    const fetcher = useFetcher<typeof clientAction>();
    const quiz_context = useOutletContext<Quiz_Context>();

    const is_loading = fetcher.data == undefined;

    const did_receive_results = fetcher.data != undefined && fetcher.data.has_data && quiz_context.quiz != undefined;

    const fetcher_used_ref = useRef(false);
    useEffect(() => {
        // prevent react strict mode from using fetcher twice
        if (!fetcher_used_ref.current) {
            fetcher_used_ref.current = true;
            fetcher.submit(quiz_context.chosen_options, {
                action: "",
                method: "POST",
                encType: "application/json",
            });
        }
    });

    const question_results = did_receive_results
        ? fetcher.data!.question_results!.map((question_result) => {
              return <Question_Result_C key={question_result.question_id} question_result={question_result} />;
          })
        : [];
    const no_of_correct_answers = did_receive_results
        ? fetcher.data!.question_results!.reduce((total_correct, question_result) => {
              return question_result.is_correct ? total_correct + 1 : total_correct;
          }, 0)
        : 0;

    const [question_result_index, set_question_result_index] = useState(0);
    function previous_question() {
        set_question_result_index(question_result_index - 1);
    }

    function next_question() {
        set_question_result_index(question_result_index + 1);
    }

    return is_loading ? (
        <div className="loading"> Loading Results... </div>
    ) : did_receive_results ? (
        <div className="quiz_results">
            <div className="quiz_score">{`Score: ${no_of_correct_answers} / ${question_results.length}`}</div>

            {question_results![question_result_index]}

            <div className="question_buttons">
                <button className="question_change" onClick={previous_question} disabled={question_result_index == 0}>
                    Previous Question
                </button>
                <button
                    className="question_change"
                    onClick={next_question}
                    disabled={question_result_index == question_results!.length - 1}
                >
                    Next Question
                </button>
            </div>

            <Link to={get_pathname_to_all_quizzes()} className="all_quizzes">
                Go To All Quizzes
            </Link>
        </div>
    ) : (
        <div className="error">The Results Could Not Be Calculated</div>
    );
}

function Question_Result_C({ question_result }: { question_result: Question_Result }) {
    return (
        <div className={`question_result_info ${question_result.is_correct ? "correct_answer" : "incorrect_answer"}`}>
            <div className="question_description">{question_result.description}</div>

            <div className="all_option_results">
                {question_result.options.map((option) => {
                    return (
                        <Option_Result_C
                            key={option.option_id}
                            option={option}
                            correct_option_id={question_result.correct_option_id}
                            chosen_option_id={question_result.chosen_option_id}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function Option_Result_C({
    option,
    correct_option_id,
    chosen_option_id,
}: {
    option: Option;
    correct_option_id: number;
    chosen_option_id: number;
}) {
    const option_css_class =
        option.option_id == correct_option_id ? "correct_option" : option.option_id == chosen_option_id ? "incorrect_option" : "";
    return <div className={`option_result ${option_css_class}`}>{option.value}</div>;
}
