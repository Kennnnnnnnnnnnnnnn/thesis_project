import axios from "axios";

export const useDeliveryBot = () => {
    const botToken = '7627096663:AAFk74482p4iDhT-_E9Xwarp8Y-pya3ndbo';
    const chatId = '1058951332';

    const telegramURL = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const sendToTelegram = async (text) => {
        try {
            const response = await axios.post(telegramURL, {
                chat_id: chatId,
                text,
                parse_mode: "Markdown",
                disable_web_page_preview: false
            });
            
            if (!response.data.ok) {
                throw new Error(`Telegram API error: ${response.data.description}`);
            }
            
            return response.data;
        } catch (err) {
            console.error("Failed to send Telegram message:", err);
            throw err; // Re-throw to handle in the component
        }
    };

    return { sendToTelegram };
};

