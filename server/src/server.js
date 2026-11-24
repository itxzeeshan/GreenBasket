import "dotenv/config";
import app from "./app.js";
import { config } from "./shared/config.js";

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
