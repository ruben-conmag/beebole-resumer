import { sendNotification } from "./sendNotification.js";

const { BEEBOLE_BASE64_API_TOKEN, BEEBOLE_USER_ID } = process.env;

const BEEBOLE_API_ENDPOINT = "https://beebole-apps.com/api/v2";

/**
 * Determines the appropriate date for fetching Beebole time entries.
 * On Mondays, it returns the previous Friday; otherwise, it returns the previous day.
 * @param {Date} [referenceDateTime=new Date()] - The reference date and time. Defaults to the current date and time.
 * @returns {Date} The calculated date for fetching time entries.
 */
export const determineTargetDate = (referenceDateTime = new Date()) => {
  const dayOfWeek = referenceDateTime.getDay(); // 0 (Sunday) to 6 (Saturday)
  const isMonday = dayOfWeek === 1;
  const daysToSubtract = isMonday ? 3 : 1;
  const targetDate = new Date(referenceDateTime);
  targetDate.setDate(targetDate.getDate() - daysToSubtract);
  return targetDate;
};

/**
 * Validates that the provided date is either a string or a Date object.
 * @param {string | Date} date - The date to validate.
 * @returns {string} The validated date in "yyyy-MM-dd" format.
 * @throws {Error} If the date is not a string or a Date object.
 */
const validateAndFormatDate = (date) => {
  if (typeof date === "string") {
    return date;
  }

  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  throw new Error(
    "Invalid date provided. The date must be a string in 'yyyy-MM-dd' format or a Date instance."
  );
};

/**
 * Formats a single Beebole time entry into a human-readable string.
 * @param {object} entry - The Beebole time entry object.
 * @returns {string} The formatted entry string.
 */
const formatBeeboleEntry = (entry) => {
  const projectName = entry.project?.name ?? entry.subproject?.name;
  const taskName = entry.task?.name || "";
  const comment = entry.comment || "";
  return `${projectName}${taskName ? ` | ${taskName}` : ""}${
    comment ? ` : ${comment}` : ""
  }`;
};

/**
 * Fetches time entries from the Beebole API for a specific date.
 * @param {string} targetDate - The target date for fetching entries in "yyyy-MM-dd" format.
 * @returns {Promise<object[]>} A promise that resolves with the fetched time entries.
 * @throws {Error} If there's an error fetching data from the API.
 */
const fetchBeeboleEntries = async (targetDate) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${BEEBOLE_BASE64_API_TOKEN}`,
    },
    body: JSON.stringify({
      service: "time_entry.list",
      person: { id: BEEBOLE_USER_ID },
      from: targetDate,
      to: targetDate,
    }),
  };
  const response = await fetch(BEEBOLE_API_ENDPOINT, requestOptions);
  const data = await response.json();
  if (data.status === "error") {
    throw new Error(`Error fetching data from Beebole API: ${data.message}`);
  }
  return data.timeEntries;
};

/**
 * Fetches time entries from the Beebole API for a specific date, formats them,
 * and sends a notification with the formatted entries.
 *
 * @param {string|Date} date - The target date for fetching entries.
 * @returns {Promise<void>} - Resolves when the notification is sent or rejects if an error occurs.
 */
export const fetchAndSendBeeboleEntries = async (date) => {
  try {
    const validatedTargetDate = validateAndFormatDate(date);
    const beeboleTimeEntries = await fetchBeeboleEntries(validatedTargetDate);
    const formattedEntries = beeboleTimeEntries
      .sort((a, b) => a.stime.localeCompare(b.stime)) // Sort entries by start time
      .map(formatBeeboleEntry)
      .filter((entry, index, entries) => entries.indexOf(entry) === index); // Remove duplicate entries

    // Prepare the notification message
    const formattedEntriesString = formattedEntries.join("\n");
    const message = `Beebole entries for: ${validatedTargetDate}\n\u23AF\n${formattedEntriesString}\n\u23AF\n`;

    // Send the notification
    await sendNotification(message);

    return message;
  } catch (error) {
    console.error("Error fetching or processing Beebole entries:", error);
  }
};
