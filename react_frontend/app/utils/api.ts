import {type Quiz, type Question, type Question_Result, type Answer} from "./api_types";

const BASE_URL = "http://127.0.0.1:8000/quiz/";
URL
export function get_all_quizzes():Quiz[]{
    const url = BASE_URL;

}

export function get_quiz_info(quiz_id:number):Quiz{
    const url = `${BASE_URL}${quiz_id}`;
}

export function start_quiz(quiz_id:number):void{
    const url = `${BASE_URL}${quiz_id}/start`;
}

export function get_quiz_questions(quiz_id:number):Question[]{
    const url = `${BASE_URL}${quiz_id}/attempt`;
}

export function submit_quiz_answers_and_get_results(quiz_id:number, answers:Answer):Question_Result[]{
    const url = `${BASE_URL}${quiz_id}/result`;
}
