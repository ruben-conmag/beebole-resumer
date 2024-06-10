import { sendDiscordNotification } from "./integrations/discord.js";

const {
    DISCORD_WEBHOOK_URL,
} = process.env;

export const sendNotification = async (message) => {
    if (DISCORD_WEBHOOK_URL) await sendDiscordNotification(message);
    else console.log(message);
}