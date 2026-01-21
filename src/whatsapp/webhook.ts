import express from "express";
import { chatNode, initializeState } from "../graph/nodes";
import { GraphStateType as State } from "../graph/state";
import { sendWhatsAppMessage } from "../whatsapp/sendMessage";

const router = express.Router();


const historyStore = new Map<string, string[]>();

router.post("/webhook/whatsapp", async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const change = entry?.changes?.[0];
        const value = change?.value;

        // Ignore non-message events (statuses, receipts, etc.)
        if (!value?.messages || value.messages.length === 0) {
            return res.sendStatus(200);
        }

        const message = value.messages[0];

        // Only handle text messages for now
        if (message.type !== "text") {
            return res.sendStatus(200);
        }

        const from = message.from; // phone number (history key)
        const text = message.text.body;

        // Load conversation history (replace with Redis later)
        const history = historyStore.get(from) || [];

        const state: State = initializeState({
            customerQuestion: text,
            history,
        })


        // Call agent
        const updatedState = await chatNode(state);

        // Persist updated history
        historyStore.set(from, updatedState?.history || []);

        // Send response back to WhatsApp
        await sendWhatsAppMessage({
            to: from,
            text: updatedState?.history.at(-1) || "",
        });

        // Acknowledge webhook
        res.status(200).json({
            status: "success",
            message: "Message sent successfully",
            data: {
                response: updatedState?.history.at(-1) || "",
                status: "success",
                message: "Message sent successfully",
            },
        });
    } catch (error) {
        console.error("Webhook error:", error);
        res.sendStatus(200); // Always acknowledge to WhatsApp
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