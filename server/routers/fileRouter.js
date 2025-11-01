import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import {
  get_preview,
  get_download,
  post_Avatar,
  post_document,
} from '../controllers/fileController.js';
import { authValidation } from '../middleware/userMiddleware.js';

const router = express.Router();

// 简单的本地磁盘存储
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    const base = path.basename(file.originalname || 'file', ext).replace(/\s+/g, '_').slice(0, 60);
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});
const upload = multer({ storage });

// 预览/下载（可选）
router.get('/preview/:name', get_preview);
router.get('/download/:name', get_download);

// 头像
router.post('/upload/avatar', upload.single('file'), authValidation, post_Avatar);

// 其他文档（driver-license / opt-receipt / ead / i-983 / i-20）
router.post('/upload', upload.single('file'), authValidation, post_document);

export default router;
