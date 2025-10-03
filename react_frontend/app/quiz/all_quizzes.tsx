import { get_all_quizzes } from "../utils/api";
import type { Quiz } from "../utils/api_types";
import { Link } from "react-router";
import type { Route } from "./+types/all_quizzes";
import { get_pathname_to_attempt_quiz } from "../routes";

export async function clientLoader() {
    try {
        const quizzes = await get_all_quizzes();
        return { quizzes: quizzes, has_data: true };
    } catch (error) {
        return { error: String(error), has_data: false };
    }
}

export default function Home({ loaderData }: Route.ComponentProps) {
    return (
        <div>
            <h1>Quizzes</h1>
            {loaderData.has_data ? (
                loaderData.quizzes!.map((quiz) => {
                    return <Quiz_C key={quiz.quiz_id} quiz={quiz} />;
                })
            ) : (
                <div className="error"> The Quizzes Could not be loaded. </div>
            )}
        </div>
    );
}

function Quiz_C({ quiz }: { quiz: Quiz }) {
    return (
        <Link to={get_pathname_to_attempt_quiz(quiz)} className="quiz_start">
            {quiz.name} {quiz.no_of_questions} question{quiz.no_of_questions == 1 ? "" : "s"}
        </Link>
    );
}
