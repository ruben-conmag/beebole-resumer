import "dotenv/config";
import { fetchAndSendBeeboleEntries } from "./src/fetchData.js";

(async () => {
  try {
    await fetchAndSendBeeboleEntries();
    await fetchAndSendBeeboleEntries(true);
  } catch (error) {
    console.error(error);
  }
})();
