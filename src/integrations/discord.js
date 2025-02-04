const { DISCORD_WEBHOOK_NAME = "Beebole Resumer", DISCORD_WEBHOOK_URL } =
  process.env;

/**
 * Sends a message to a Discord channel using a webhook URL.
 * If the webhook URL is not set, the function logs a warning and skips sending the message.
 *
 * @param {string} messageContent - The content of the message to be sent to Discord.
 * @returns {Promise<void>} - Resolves when the message is sent successfully or rejects if an error occurs.
 * @throws {Error} - Throws an error if the request to the Discord webhook fails.
 */
export const sendDiscordMessage = async (messageContent) => {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn("DISCORD_WEBHOOK_URL is not set. Skipping Discord message.");
    return;
  }

  const requestBody = {
    username: DISCORD_WEBHOOK_NAME,
    content: messageContent,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  };

  const response = await fetch(DISCORD_WEBHOOK_URL, requestOptions);

  if (!response.ok) {
    throw new Error(`Error sending message to Discord: ${response.statusText}`);
  }

  console.log(
    `Discord message sent successfully to webhook: ${DISCORD_WEBHOOK_URL}`
  );
};
