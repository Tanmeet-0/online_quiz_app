import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

startTransition(() => {
    hydrateRoot(
        document,
        <StrictMode>
            <title>Quizzes</title>
            <link rel="icon" type="image/png" href="./favicon.png"></link>
            <HydratedRouter />
        </StrictMode>,
    );
});
