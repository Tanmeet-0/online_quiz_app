import type { Route } from "./+types/quiz_attempt";
import { start_quiz_and_get_quiz_questions } from "../utils/api";
import type { Question, Option } from "../utils/api_types";
import { useState, useId } from "react";
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
    const has_quiz_started = quiz_context.quiz != undefined && loaderData.has_data;

    const questions = has_quiz_started
        ? loaderData.questions!.map((question) => {
              return <Question_C key={question.question_id} question={question} />;
          })
        : [];

    const [question_index, set_question_index] = useState(0);
    function previous_question() {
        set_question_index(question_index - 1);
    }

    function next_question() {
        set_question_index(question_index + 1);
    }

    const are_all_questions_answered = Object.keys(quiz_context.chosen_options).length == questions!.length;

    return has_quiz_started ? (
        <div className="quiz_questions">
            {questions![question_index]}

            <div className="question_buttons">
                <button className="question_change" onClick={previous_question} disabled={question_index == 0}>
                    Previous Question
                </button>
                <button className="question_change" onClick={next_question} disabled={question_index == questions!.length - 1}>
                    Next Question
                </button>
            </div>

            <Link
                to={are_all_questions_answered ? get_pathname_to_quiz_result(quiz_context.quiz!) : ""}
                className={`quiz_submit ${are_all_questions_answered ? "" : "disabled"}`}
                tabIndex={are_all_questions_answered ? 0 : -1}
            >
                Submit Quiz
            </Link>
        </div>
    ) : (
        <div className="error">The Quiz Could Not Be Started</div>
    );
}

function Question_C({ question }: { question: Question }) {
    const quiz_context = useOutletContext<Quiz_Context>();

    function is_option_checked(option: Option): boolean {
        if (Object.hasOwn(quiz_context.chosen_options, question.question_id)) {
            return quiz_context.chosen_options[question.question_id] == option.option_id;
        }
        return false;
    }

    function on_option_change(option_id: string): void {
        const new_chosen_options = { ...quiz_context.chosen_options };
        new_chosen_options[question.question_id] = parseInt(option_id);
        quiz_context.set_chosen_options(new_chosen_options);
    }

    return (
        <div className="question_info">
            <div className="question_description">{question.description}</div>

            <div className="all_options">
                {question.options.map((option) => {
                    return (
                        <Option_C
                            key={option.option_id}
                            option={option}
                            is_option_checked={is_option_checked}
                            on_option_change={on_option_change}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function Option_C({
    option,
    is_option_checked,
    on_option_change,
}: {
    option: Option;
    is_option_checked: (option: Option) => boolean;
    on_option_change: (option_id: string) => void;
}) {
    const unique_id = useId();
    return (
        <label className="option">
            <input
                className="option"
                type="radio"
                id={unique_id}
                value={option.option_id}
                checked={is_option_checked(option)}
                onChange={(event) => {
                    on_option_change(event.target.value);
                }}
            />
            {option.value}
        </label>
    );
}
