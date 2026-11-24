import express from "express";
import cors from "cors";
import { isDbConnected } from "./shared/db.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (req, res) => {
  if (isDbConnected()) {
    return res.status(200).json({ status: "ok", db: "connected" });
  }
  return res.status(503).json({ status: "degraded", db: "disconnected" });
});

export default app;
