// server/app.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { AppError } from "./utils/appError.js";
import globalErrorHandler from "./controllers/errController.js";

import userRouter from "./routers/userRouter.js";
import hrRouter from "./routers/hrRouter.js";
import fileRouter from "./routers/fileRouter.js";
import onboardingRouter from "./routers/onboardingRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// ——开发日志——
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

// ——CORS（允许 X-Demo-Userid & multipart）——
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Demo-Userid"],
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", corsOptions.origin);
    res.header("Access-Control-Allow-Methods", corsOptions.methods.join(","));
    res.header("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(","));
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204);
  }
  next();
});

// ——Body 解析——
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// ——静态：本地 uploads 目录暴露成可访问 URL（返回的 url 会用到）——
const uploadsDir = path.join(process.cwd(), "uploads");
app.use("/api/files/raw", express.static(uploadsDir));

// ——路由——
app.use("/api/user", userRouter);
app.use("/api/hr", hrRouter);
app.use("/api/onboarding", onboardingRouter);
app.use("/api/file", fileRouter);

// ——404 & 错误处理——
app.use((req, _res, next) => next(new AppError("Not Found", 404)));
app.use(globalErrorHandler);

export default app;
