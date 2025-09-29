import { type Quiz, type Question, type Question_Result, type Answer } from "./api_types";

const BASE_URL = "http://127.0.0.1:8000/quiz/";
URL;
export async function get_all_quizzes(): Promise<Quiz[]> {
    const url = BASE_URL;
    var response = await fetch(url);
    var quizzes = await response.json();
    return quizzes as Quiz[];
}

export async function get_quiz_info(quiz_id: number): Promise<Quiz> {
    const url = `${BASE_URL}${quiz_id}`;
    var response = await fetch(url);
    var quiz = await response.json();
    return quiz as Quiz;
}

export async function start_quiz(quiz_id: number): Promise<void> {
    const url = `${BASE_URL}${quiz_id}/start`;
    var response = await fetch(url);
    return;
}

export async function get_quiz_questions(quiz_id: number): Promise<Question[]> {
    const url = `${BASE_URL}${quiz_id}/attempt`;
    var response = await fetch(url);
    var questions = await response.json();
    return questions as Question[];
}

export async function submit_quiz_answers_and_get_results(quiz_id: number, answers: Answer): Promise<Question_Result[]> {
    const url = `${BASE_URL}${quiz_id}/result`;
    var response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(answers),
        headers: { "Content-Type": "application/json" },
    });
    var result = await response.json();
    return result as Question_Result[];
}
