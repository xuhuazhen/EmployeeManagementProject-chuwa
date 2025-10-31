// server/index.js
import "dotenv/config";            // 先加载 .env
import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = process.env.PORT || 3000;

async function start() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is up and running on: http://localhost:${port}`);
  });
}

start();
