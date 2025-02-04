import "dotenv/config";
import { fetchAndSendBeeboleEntries, determineTargetDate } from "./src/fetchData.js";

(async () => {
  try {
    const today = new Date();
    const previousDate = determineTargetDate(today);

    await fetchAndSendBeeboleEntries(previousDate);
    await fetchAndSendBeeboleEntries(today);
  } catch (error) {
    console.error(error);
  }
})();
