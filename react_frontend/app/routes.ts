import { type RouteConfig, index, layout, route, prefix } from "@react-router/dev/routes";
import type { Quiz } from "./utils/api_types";

export default [
    index("./quiz/all_quizzes.tsx"),
    ...prefix(":quiz_id", [
        layout("./quiz/quiz_layout.tsx", [
            route("attempt", "./quiz/quiz_attempt.tsx"),
            route("result", "./quiz/quiz_result.tsx"),
        ]),
    ]),
] satisfies RouteConfig;

export function get_pathname_to_attempt_quiz(quiz: Quiz): string {
    return `/${quiz.quiz_id}/attempt`;
}

export function get_pathname_to_quiz_result(quiz: Quiz): string {
    return `/${quiz.quiz_id}/result`;
}

export function get_pathname_to_all_quizzes(): string {
    return "/";
}
