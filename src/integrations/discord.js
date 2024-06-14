const { DISCORD_WEBHOOK_NAME = "Beebole Resumer", DISCORD_WEBHOOK_URL } =
  process.env;

export const sendDiscordMessage = async (message) => {
  // Send a POST request to the Discord webhook URL with the message
  const response = await fetch(DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: DISCORD_WEBHOOK_NAME,
      content: message,
    }),
  });

  // Throw an error if the request fails
  if (!response.ok) {
    throw new Error(`Error sending message to Discord: ${response.statusText}`);
  }

  // Log a success message if the request is successful
  console.log("Discord message sent successfully!");
};
