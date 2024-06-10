const { DISCORD_WEBHOOK_NAME = "Beebole Resumer", DISCORD_WEBHOOK_URL } =
  process.env;

export const sendDiscordNotification = async (message) => {
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

  if (!response.ok) {
    throw new Error(`Error sending notification: ${response.statusText}`);
  } else {
    console.log("Discord message sent and data fetched successfully!");
  }
};
