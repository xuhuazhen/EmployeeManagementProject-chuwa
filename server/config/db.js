// server/config/db.js
import mongoose from "mongoose";

const { DATABASE, DATABASE_PASSWORD } = process.env;
const DB_URL = DATABASE?.replace("<PASSWORD>", DATABASE_PASSWORD);

mongoose.set("strictQuery", false);

export async function connectDB() {
  try {
    const conn = await mongoose.connect(DB_URL);
    console.log("DB connection success!");
    return conn.connection;
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
}
