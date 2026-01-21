import { GraphStateType } from "./state";
import { model } from "../model";
import { prompt } from "./prompt";
import { readFileSync } from "fs";
import { join } from "path";
import "dotenv/config";

const greenleafDental = readFileSync(
    join(__dirname, "../business-documents/greenleaf-dental.md"),
    "utf-8"
);


export function initializeState({ customerQuestion, history }: { customerQuestion: string, history: string[] }) {
    return {
        businessDocument: [greenleafDental],
        history: history || [],
        customerQuestion: customerQuestion || "",
    }
}

export async function chatNode(state: GraphStateType) {
    if (!state.customerQuestion) return;

    const formattedPrompt = prompt
        .replace("{{BUSINESS_DOCUMENT}}", state.businessDocument.join("\n\n"))
        .replace("{{HISTORY}}", (state.history || []).join("\n"))
        .replace("{{CUSTOMER_QUESTION}}", state.customerQuestion);

    const response = await model.invoke([{ role: "system", content: formattedPrompt }]);

    return {
        history: [
            ...(state.history || []),
            `User: ${state.customerQuestion}`,
            `Assistant: ${response.content}`,
        ],
    };

}

async function test() {
    let state: GraphStateType = {
        customerQuestion: "",
        businessDocument: [greenleafDental],
        history: [],
    } as GraphStateType;

    // Phase 1 test
    state.customerQuestion = "Do you accept walk-ins?";
    state = {
        ...state,
        ...(await chatNode(state)),
    };
    console.log(state.history.at(-1));

    // Phase 2 follow-up
    state.customerQuestion = "What about Saturday?";
    state = {
        ...state,
        ...(await chatNode(state)),
    };
    console.log(state.history.at(-1));
}

test();
