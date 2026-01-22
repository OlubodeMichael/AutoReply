import { GraphStateType } from "./state";
import { model } from "../model";
import { prompt } from "./prompt";
import { readFileSync } from "fs";
import { join } from "path";
import "dotenv/config";
import { ChatTurn } from "./types";

const greenleafDental = readFileSync(
    join(__dirname, "../business-documents/greenleaf-dental.md"),
    "utf-8"
);


export function initializeState({
    customerQuestion,
    history,
}: {
    customerQuestion: string;
    history: ChatTurn[];
}): GraphStateType {
    return {
        customerQuestion,
        history,
        businessDocument: [greenleafDental], // or routed doc
    };
}


export async function chatNode(state: GraphStateType) {
    if (!state.customerQuestion) return;

    const formattedPrompt = prompt
        .replace("{{BUSINESS_DOCUMENT}}", state.businessDocument.join("\n\n"))
        .replace("{{HISTORY}}", (state.history || []).map(turn => `${turn.role}: ${turn.content}`).join("\n"))
        .replace("{{CUSTOMER_QUESTION}}", state.customerQuestion);

    const response = await model.invoke([{ role: "system", content: formattedPrompt }]);
    const answer = response.content as string;

    const updatedHistory: ChatTurn[] = [
        ...(state.history || []),
        { role: "user", content: state.customerQuestion },
        { role: "assistant", content: answer },
    ];

    return {
        answer,
        history: updatedHistory,
    };

}

// Test function - uncomment and run manually if needed
// async function test() {
//     let state: GraphStateType = {
//         customerQuestion: "",
//         businessDocument: [greenleafDental],
//         history: [],
//     } as GraphStateType;

//     // Phase 1 test
//     state.customerQuestion = "Do you accept walk-ins?";
//     state = {
//         ...state,
//         ...(await chatNode(state)),
//     };
//     console.log(state.history.at(-1));

//     // Phase 2 follow-up
//     state.customerQuestion = "What about Saturday?";
//     state = {
//         ...state,
//         ...(await chatNode(state)),
//     };
//     console.log(state.history.at(-1));
// }

// test();
