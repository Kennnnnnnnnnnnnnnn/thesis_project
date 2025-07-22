import axios from "axios";

export const useTelegram = () => {


    // dalin
    const botToken = '7523602076:AAE7jPxs7zOzdFNX_QzXZnhiIcW4EeOeRoc';
    const chatId = '1058951332';



    const telegramURL = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const sendToTelegram = async (text) => {
        try {
            await axios.post(telegramURL, {
                chat_id: chatId,
                text,
                parse_mode: "Markdown"
            });
        } catch (err) {
            console.error("Failed to send Telegram message:", err);
        }
    };

    return { sendToTelegram };
};
