import { StateGraph } from "@langchain/langgraph";
import { initializeState, chatNode } from "./nodes";
import { GraphState } from "./state";

const graph = new StateGraph(GraphState);
graph.addNode("initialize", initializeState);
graph.addNode("chat", chatNode);



export default graph;