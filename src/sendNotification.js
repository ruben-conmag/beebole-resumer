import { sendDiscordMessage } from "./integrations/discord.js";

const { DISCORD_WEBHOOK_URL } = process.env;

export const sendNotification = async (message) => {
  // Check if a Discord webhook URL is configured
  if (DISCORD_WEBHOOK_URL) {
    // Send the message to Discord using the helper function
    await sendDiscordMessage(message);
  } else {
    // Fallback: Log the message to the console
    console.log(message);
  }
};
