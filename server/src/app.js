import express from "express";

const app = express();

app.use(express.json()); // take request in the format of Json

// mount routes (health in 2.11)

module.exports = app;
