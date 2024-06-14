import { DateTime } from "luxon";
import { sendNotification } from "./sendNotification.js";

const { BASE64_AUTH_TOKEN, USER_ID } = process.env;

const getEntryDate = (useToday = false) => {
  // Get the current date and time
  const currentDate = DateTime.now();

  // If useToday is true, return the date in yyyy-MM-dd format
  if (useToday) {
    return currentDate.toFormat("yyyy-MM-dd");
  }

  // Calculate the number of days to subtract based on the weekday
  const daysToSubtract = currentDate.weekday === 1 ? 3 : 1;

  // Return the date minus the calculated days in yyyy-MM-dd format
  return currentDate.minus({ days: daysToSubtract }).toFormat("yyyy-MM-dd");
};

export const fetchAndSendBeeboleEntries = async (useToday = false) => {
  // Get the date for which to fetch entries
  const targetDate = getEntryDate(useToday);

  // Construct the request options
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${BASE64_AUTH_TOKEN}`,
    },
    body: JSON.stringify({
      service: "time_entry.list",
      person: { id: USER_ID },
      from: targetDate,
      to: targetDate,
    }),
  };

  try {
    // Fetch data from the Beebole API
    const response = await fetch(
      "https://beebole-apps.com/api/v2",
      requestOptions
    );
    const data = await response.json();

    // Check for errors in the response
    if (data.status === "error") {
      throw new Error(`Error fetching data: ${data.message}`);
    }

    // Format and filter entries
    const formattedEntries = data.timeEntries
      .sort((a, b) => a.stime.localeCompare(b.stime))
      .map((entry) => {
        const projectName = entry.project.name;
        const taskName = entry.task.name || "";
        const comment = entry.comment || "";
        return `${projectName}${taskName ? ` | ${taskName}` : ""}${
          comment ? ` : ${comment}` : ""
        }`;
      })
      .filter((entry, index, entries) => entries.indexOf(entry) === index); // Remove duplicates

    // Prepare the notification message
    const entriesString = formattedEntries.join("\n");
    const message = `Beebole entries for: ${targetDate}\n\u23AF\n${entriesString}\n\u23AF\n`;

    // Send the notification
    sendNotification(message);
  } catch (error) {
    console.error("Error fetching or processing Beebole entries:", error);
  }
};
