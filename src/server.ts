import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import webhookRouter from "./whatsapp/webhook";


dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));



app.get("/", (req, res) => {
    res.send("Hello World");
});

// Mount the webhook router
app.use(webhookRouter);



export default app;