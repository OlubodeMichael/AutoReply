import { ChatOpenAI } from "@langchain/openai";

export const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.7,
});