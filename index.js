import "dotenv/config";
import { fetchData } from "./src/fetchData.js";
const {
    BASE64_AUTH_TOKEN,
    USER_ID,
    DISCORD_WEBHOOK_URL,
    DISCORD_WEBHOOK_NAME
} = process.env;

console.log(BASE64_AUTH_TOKEN)
console.log(USER_ID)
console.log(DISCORD_WEBHOOK_URL)
console.log(DISCORD_WEBHOOK_NAME)

fetchData().catch((err) => {
    console.error(err);
});
