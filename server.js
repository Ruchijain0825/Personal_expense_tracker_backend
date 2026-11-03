import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env BEFORE importing app.js
dotenv.config({
  path: path.join(__dirname, ".env"),
  override: true
});

console.log("GROQ KEY LOADED:", Boolean(process.env.GROQ_API_KEY));
console.log("NODE_ENV:", process.env.NODE_ENV);

const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 8080;

try {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected successfully!");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Server startup failed:", error.message);
  process.exit(1);
}