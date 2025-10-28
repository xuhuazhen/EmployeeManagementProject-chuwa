// Server/app.js
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

// 打印每个请求，方便排查
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

// ---- CORS（注意：不要再写 app.options("*") 了）----
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// 兼容 express v5：手动处理 OPTIONS 预检
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", corsOptions.origin);
    res.header("Access-Control-Allow-Methods", corsOptions.methods.join(","));
    res.header(
      "Access-Control-Allow-Headers",
      corsOptions.allowedHeaders.join(",")
    );
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204);
  }
  next();
});

// 兼容 express v5：手动处理 OPTIONS 预检
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", corsOptions.origin);
    res.header("Access-Control-Allow-Methods", corsOptions.methods.join(","));
    res.header(
      "Access-Control-Allow-Headers",
      corsOptions.allowedHeaders.join(",")
    );
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204);
  }
  next();
});

// 解析 body & 静态资源
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.json("Hello");
});

// 路由（注意这里仅写“路径片段”，不要写完整 URL）
app.use("/api/user", userRouter);
app.use("/api/hr", hrRouter);
app.use("api/onboarding", onboardingRouter);
app.use("/api/file", fileRouter);

// 404
app.use((req, res, next) => {
  next(
    new AppError("Sorry, we couldn’t find the page you’re looking for.", 404)
  );
});

// 统一错误处理（务必是最后一个）
app.use(globalErrorHandler);

export default app;
