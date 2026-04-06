import mongoose from "mongoose";
import { ENV } from "./config.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.databaseURL);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Error: ${err.message}`);
    process.exit(1);
  }
};
