import { Annotation } from "@langchain/langgraph";
import { ChatTurn } from "./types";

export const GraphState = Annotation.Root({
    customerQuestion: Annotation<string>(),
    businessDocument: Annotation<string[]>(),
    history: Annotation<ChatTurn[]>(),
});

export type GraphStateType = typeof GraphState.State;