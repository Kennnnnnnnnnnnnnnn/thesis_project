import axios from "axios";

export const useTelegram = () => {

    // monthy
    // const botToken = '7876712552:AAGl4DL9rJOvbcJVtJ-OqEH8_C-_gJ-qLw0';
    // const chatId = '1088041386';


    // dalin
    const botToken = '7598922370:AAEkpJuDNbqshQ-SklazfWwuZm8F7gqsDvc';
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
