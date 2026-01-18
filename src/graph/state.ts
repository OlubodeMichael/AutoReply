import { StateGraph, Annotation } from "@langchain/langgraph";

export const GraphState = Annotation.Root({
    message: Annotation<string>(),
    response: Annotation<string>(),
    context: Annotation<string>(),
    history: Annotation<string>(),
    metadata: Annotation<string>(),
    errors: Annotation<string>(),
    logs: Annotation<string>(),
    timestamps: Annotation<string>(),
});

export type GraphStateType = typeof GraphState.State;