import "dotenv/config";
import { fetchData } from "./src/fetchData.js";

fetchData().catch((err) => {
    console.error(err);
});
