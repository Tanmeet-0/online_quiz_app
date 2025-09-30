import { type Quiz, type Question, type Question_Result, type Chosen_Options } from "./api_types";

const BASE_URL = "http://127.0.0.1:8000/quiz";
const HEADERS = { Accept: "application/json" };

export async function get_all_quizzes(): Promise<Quiz[]> {
    const url = `${BASE_URL}/all`;
    var response = await fetch(url, { headers: HEADERS });
    var quizzes = await response.json();
    return quizzes as Quiz[];
}

export async function get_quiz_info(quiz_id: string): Promise<Quiz> {
    const url = `${BASE_URL}/${quiz_id}`;
    var response = await fetch(url, { headers: HEADERS });
    var quiz = await response.json();
    return quiz as Quiz;
}

export async function start_quiz_and_get_quiz_questions(quiz_id: string): Promise<Question[]> {
    const url = `${BASE_URL}/${quiz_id}/start`;
    var response = await fetch(url, { headers: HEADERS });
    var questions = await response.json();
    return questions as Question[];
}

export async function submit_quiz_answers_and_get_results(quiz_id: string, answers: Chosen_Options): Promise<Question_Result[]> {
    const url = `${BASE_URL}/${quiz_id}/end`;
    var response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(answers),
        headers: { "Content-Type": "application/json", ...HEADERS },
    });
    var result = await response.json();
    return result as Question_Result[];
}
