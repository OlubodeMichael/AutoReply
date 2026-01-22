
export type ChatTurn = {
    role: "user" | "assistant";
    content: string;
};

export type AgentAction =
    | "ANSWER"
    | "ASK_CLARIFICATION"
    | "REQUEST_APPOINTMENT"
    | "ESCALATE_TO_HUMAN";
