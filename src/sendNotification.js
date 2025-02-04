import { sendDiscordMessage } from "./integrations/discord.js";

/**
 * Sends a notification by attempting to send a message to Discord.
 * If sending fails, the error is logged, and the message is always logged to the console as a fallback.
 *
 * @param {string} message - The message content to be sent as a notification.
 * @returns {Promise<void>} - Resolves once the notification process is complete.
 */
export const sendNotification = async (message) => {
  try {
    // Send the message to Discord using the helper function
    await sendDiscordMessage(message);
  } catch (error) {
    console.error("Error sending message to Discord:", error);
  }

  // Always log the message to the console as a fallback
  console.log("Notification:", message);
};
