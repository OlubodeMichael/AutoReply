import express from "express";
import { chatNode, initializeState } from "../graph/nodes";
import { GraphStateType as State } from "../graph/state";
import { sendWhatsAppMessage } from "../whatsapp/sendMessage";
import { ChatTurn } from "../graph/types";

const router = express.Router();


const historyStore = new Map<string, ChatTurn[]>();
const processedMessageIds = new Set<string>();

router.post("/webhook/whatsapp", async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const change = entry?.changes?.[0];
        const value = change?.value;

        if (!value?.messages || value.messages.length === 0) {
            return res.sendStatus(200);
        }

        const message = value.messages[0];
        const messageId = message.id;

        if (processedMessageIds.has(messageId)) {
            return res.sendStatus(200);
        }

        processedMessageIds.add(messageId);

        if (message.type !== "text") {
            return res.sendStatus(200);
        }

        const from = message.from;
        const text = message.text.body;

        const history = historyStore.get(from) || [];

        const state: State = initializeState({
            customerQuestion: text,
            history,
        });

        const result = await chatNode(state);

        if (!result) {
            return res.sendStatus(200);
        }

        const { answer } = result;

        const updatedHistory: ChatTurn[] = [
            ...history,
            { role: "user", content: text },
            { role: "assistant", content: answer },
        ];

        historyStore.set(from, updatedHistory);

        await sendWhatsAppMessage({
            to: from,
            text: answer,
        });

        res.status(200).json({
            status: "success",
            message: "Message sent successfully",
            data: {
                response: answer,
                status: "success",
                message: "Message sent successfully",
            },
        });
    } catch (error) {
        console.error("Webhook error:", error);
        res.sendStatus(200);
    }
});



router.get("/webhook/whatsapp", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // Verify the webhook
    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        console.log("Webhook verified");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

router.get("/health", (req, res) => {
    res.send("OK");
});

export default router;