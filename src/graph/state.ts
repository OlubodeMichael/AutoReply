import { Annotation } from "@langchain/langgraph";

export const GraphState = Annotation.Root({
    customerQuestion: Annotation<string>(),
    businessDocument: Annotation<string[]>(),
    history: Annotation<string[]>(),
});

export type GraphStateType = typeof GraphState.State;