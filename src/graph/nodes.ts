import { StateGraph } from "@langchain/langgraph";
import { GraphStateType } from "./state";

export function createNodes(state: GraphStateType) {
    return {
        message: async ({ message }: { message: string }) => {
            return { response: `Hello, ${message}` };
        },
    }
}