// server/app.js
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { AppError } from './utils/appError.js';
import globalErrorHandler from './controllers/errController.js';

import userRouter from './routers/userRouter.js';
import onboardingRouter from './routers/onboardingRouter.js'; // 新增
import filesRouter from './routers/files.js';                 // 新增
import hrRouter from './routers/hrRouter.js';
// import applicationRouter from './routers/applicationRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 打印每个请求，方便排查
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

// CORS（交给 cors 统一处理预检）
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions)); 

// 兼容 express v5：手动处理 OPTIONS 预检
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

// 解析 body & cookie
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态资源（可选）
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- 健康检查 ---------- */
app.get('/health', (_req, res) => res.json({ ok: true }));

/* ---------- 路由挂载 ---------- */
app.use('/api/user', userRouter);
app.use('/api/onboarding', onboardingRouter); // 新增
app.use('/api/files', filesRouter);           // 新增
app.use('/api/hr', hrRouter);
// app.use('/api/application', applicationRouter);

/* ---------- 404 处理 ---------- */
app.all('*', (req, _res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
});

/* ---------- 全局错误处理（最后一个中间件） ---------- */
app.use(globalErrorHandler);

export default app;
