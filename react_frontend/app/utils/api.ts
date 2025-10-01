import { type Quiz, type Question, type Question_Result, type Chosen_Options } from "./api_types";

const BASE_URL = "http://127.0.0.1:8000/quiz";
const COMMON_HEADERS = { Accept: "application/json" };

export async function get_all_quizzes(): Promise<Quiz[]> {
    const url = `${BASE_URL}/all`;
    const response = await fetch(url, { headers: COMMON_HEADERS });
    const quizzes = await response.json();
    return quizzes as Quiz[];
}

export async function get_quiz_info(quiz_id: string): Promise<Quiz> {
    const url = `${BASE_URL}/${quiz_id}`;
    const response = await fetch(url, { headers: COMMON_HEADERS });
    const quiz = await response.json();
    return quiz as Quiz;
}

export async function start_quiz_and_get_quiz_questions(quiz_id: string): Promise<Question[]> {
    const url = `${BASE_URL}/${quiz_id}/start`;
    const response = await fetch(url, { method: "POST", headers: COMMON_HEADERS });
    const questions = await response.json();
    return questions as Question[];
}

export async function submit_quiz_answers_and_get_results(
    quiz_id: string,
    chosen_options: Chosen_Options,
): Promise<Question_Result[]> {
    const url = `${BASE_URL}/${quiz_id}/end`;
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(chosen_options),
        headers: { "Content-Type": "application/json", ...COMMON_HEADERS },
    });
    const question_results = await response.json();
    return question_results as Question_Result[];
}
