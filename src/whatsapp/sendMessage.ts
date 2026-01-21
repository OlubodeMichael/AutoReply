import axios from "axios";

export async function sendWhatsAppMessage({ to, text }: { to: string, text: string }) {
    const url = `https://graph.facebook.com/v24.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
            messaging_product: "whatsapp",
            to: to,
            text: {
                body: text,
            },
        }),
    })
}