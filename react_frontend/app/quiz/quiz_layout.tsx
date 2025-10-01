import type { Route } from "./+types/quiz_layout";
import { get_quiz_info } from "../utils/api";
import { Outlet } from "react-router";
import type { Quiz, Chosen_Options } from "../utils/api_types";
import { useRef } from "react";

export async function clientLoader({ params }: Route.LoaderArgs) {
    try {
        const quiz = await get_quiz_info(params.quiz_id);
        return { quiz: quiz, has_data: true };
    } catch (error) {
        return { error: String(error), has_data: false };
    }
}

export type Quiz_Context = {
    quiz: Quiz | undefined;
    chosen_options_ref: React.RefObject<Chosen_Options>;
};

export default function Quiz_Home({ loaderData }: Route.ComponentProps) {
    const chosen_options_ref = useRef<Chosen_Options>({});
    const quiz_context: Quiz_Context = {
        quiz: undefined,
        chosen_options_ref: chosen_options_ref,
    };
    if (quiz_context.quiz == undefined && loaderData.has_data) {
        quiz_context.quiz = loaderData.quiz!;
    }
    
    return (
        <div>
            {loaderData.has_data ? (
                <div>
                    <h1>{loaderData.quiz!.name}</h1>
                    <h2>
                        {loaderData.quiz!.no_of_questions} question{loaderData.quiz!.no_of_questions == 1 ? "" : "s"}
                    </h2>
                </div>
            ) : (
                "The Quiz Could Not Be Loaded"
            )}
            <Outlet context={quiz_context} />
        </div>
    );
}
