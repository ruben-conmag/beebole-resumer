import { DateTime } from "luxon";
import "dotenv/config";

const {
  BASE64_AUTH_TOKEN,
  DISCORD_WEBHOOK_NAME = "Beebole Resumer",
  DISCORD_WEBHOOK_URL,
  USER_ID,
} = process.env;

const yesterday = () => {
  const today = DateTime.now();
  const daysToSubtract = today.weekday === 1 ? 3 : 1;
  return today.minus({ days: daysToSubtract }).toFormat("yyyy-MM-dd");
};

const fetchData = async () => {
  const requestDate = yesterday();

  const response = await fetch("https://beebole-apps.com/api/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${BASE64_AUTH_TOKEN}`,
    },
    body: JSON.stringify({
      service: "time_entry.list",
      person: { id: USER_ID },
      from: requestDate,
      to: requestDate,
    }),
  }).then((resp) => resp.json());

  if (response.status === 'error') {
    throw new Error(`Error fetching data: ${response.message}`);
  }

  const formattedEntries = response.timeEntries
    .sort((a, b) => a.stime.localeCompare(b.stime))
    .map(
      (entry) =>
        `${entry.project.name}${entry.task.name ? ` | ${entry.task.name}` : ""
        }${entry.comment ? ` : ${entry.comment}` : ""}`
    );

  const uniqueEntries = new Set(formattedEntries);
  const beeboleEntries = [...uniqueEntries];
  const entriesString = beeboleEntries.join("\n");
  const message = `Beebole entries for: ${requestDate}\n\u23AF\n${entriesString}\n\u23AF\n`;

  if (DISCORD_WEBHOOK_URL) await sendDiscordNotification(message);
  else console.log(message);
};

const sendDiscordNotification = async (message) => {
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

fetchData();
