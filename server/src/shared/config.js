// server/src/shared/config.js
// Single source of truth for environment variables.
// Fails fast if MONGODB_URI is missing or malformed.

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri || mongoUri.trim() === "") {
  throw new Error(
    "Missing required environment variable: MONGODB_URI. " +
      "Copy server/.env.example to server/.env and fill it in.",
  );
}

if (
  !mongoUri.startsWith("mongodb://") &&
  !mongoUri.startsWith("mongodb+srv://")
) {
  throw new Error("MONGODB_URI must start with mongodb:// or mongodb+srv://");
}

export const config = Object.freeze({
  mongoUri,
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
});
