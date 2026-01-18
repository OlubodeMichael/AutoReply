import { StateGraph } from "@langchain/langgraph";
import { createNodes } from "./nodes";
import { GraphState } from "./state";

const graph = new StateGraph(GraphState);
graph.addNode("message", createNodes(GraphState.State).message);