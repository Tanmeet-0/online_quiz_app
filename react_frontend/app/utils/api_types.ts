export type Quiz = {
    quiz_id:number,
    name:string,
    no_of_questions:number
}

export type Question = {
    question_id:number,
    description:string,
    options:Option[]
}

export type Option = {
    option_id:number,
    value:string,
}

export type Answer = {
    [index:number]:number
}

export type Question_Result = {
    question_id : number
    correct_option_id:number,
    chosen_option_id:number,
    is_correct:boolean
}