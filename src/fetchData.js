import { DateTime } from "luxon";
import { sendNotification } from "./sendNotification.js";

const { BASE64_AUTH_TOKEN, USER_ID } = process.env;

const yesterday = () => {
  const today = DateTime.now();
  const daysToSubtract = today.weekday === 1 ? 3 : 1;
  return today.minus({ days: daysToSubtract }).toFormat("yyyy-MM-dd");
};

export const fetchData = async () => {
  const requestDate = yesterday();

  const options = {
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
  };

  const response = await fetch("https://beebole-apps.com/api/v2", options)
    .then((resp) => {
      return resp.json();
    })
    .catch((error) => {
      console.error("Error fetching or parsing data:", error);
    });

  if (response.status && response.status === "error") {
    throw new Error(`Error fetching data: ${response.message}`);
  }

  const formattedEntries = response.timeEntries
    .sort((a, b) => a.stime.localeCompare(b.stime))
    .map(
      (entry) =>
        `${entry.project.name}${
          entry.task.name ? ` | ${entry.task.name}` : ""
        }${entry.comment ? ` : ${entry.comment}` : ""}`
    );

  const uniqueEntries = new Set(formattedEntries);
  const beeboleEntries = [...uniqueEntries];
  const entriesString = beeboleEntries.join("\n");
  const message = `Beebole entries for: ${requestDate}\n\u23AF\n${entriesString}\n\u23AF\n`;

  sendNotification(message);
};
