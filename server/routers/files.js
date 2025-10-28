// server/routers/files.js
import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

/** 预览（浏览器直接打开） */
router.get('/raw/:name', (req, res) => {
  const p = path.join(process.cwd(), 'uploads', req.params.name);
  if (!fs.existsSync(p)) return res.sendStatus(404);
  res.sendFile(p);
});

/** 下载（触发保存框） */
router.get('/download/:name', (req, res) => {
  const p = path.join(process.cwd(), 'uploads', req.params.name);
  if (!fs.existsSync(p)) return res.sendStatus(404);
  res.download(p);
});

export default router;
