import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/webhook/whatsapp", (req, res) => {
    const body = req.body;
    console.log(body);
    res.send("OK");
});

app.get("/webhook/whatsapp", (req, res) => {
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


app.get("/health", (req, res) => {
    res.send("OK");
});

export default app;