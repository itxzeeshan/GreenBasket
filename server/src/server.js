// server/src/server.js
import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import app from "./app.js";
import { config } from "./shared/config.js";
import { connectDB } from "./shared/db.js";

async function start() {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
