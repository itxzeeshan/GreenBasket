import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json()); // take request in the format of Json

// mount routes (health in 2.11)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
  res.status(200).json({
    status: "ok",
    service: "GreenBasket API",
    uptime: process.uptime(),
  });
});

export default app;
