import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URL = process.env.MONGO_URL;

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connection error", err);
  }
}
