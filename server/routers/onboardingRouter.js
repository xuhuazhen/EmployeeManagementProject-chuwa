// server/routers/onboardingRouter.js
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';
import Onboarding from '../models/Onboarding.js';

const router = Router();

// 临时“登录”：用请求头模拟 userId（前端或 Postman 加 x-demo-userid）
const getUserId = (req) => req.headers['x-demo-userid'] || 'user-0001';

// 本地 uploads/ 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = mime.extension(file.mimetype) || 'bin';
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}.${ext}`);
  }
});
const upload = multer({ storage });

/** 获取我的 Onboarding */
router.get('/me', async (req, res) => {
  const userId = getUserId(req);
  const doc = await Onboarding.findOne({ userId });
  if (!doc) return res.json({ status: 'NEVER_SUBMITTED' });
  res.json(doc);
});

/** 提交/更新表单（今天：提交即置为 PENDING） */
router.post('/me', async (req, res) => {
  const userId = getUserId(req);
  const { firstName, lastName, email, workAuth } = req.body;
  const update = { userId, firstName, lastName, email, workAuth, status: 'PENDING' };
  const doc = await Onboarding.findOneAndUpdate({ userId }, update, { new: true, upsert: true });
  res.json(doc);
});

/** 上传头像 */
router.post('/me/avatar', upload.single('file'), async (req, res) => {
  const userId = getUserId(req);
  const f = req.file;
  const url = `/api/files/raw/${f.filename}`;
  const avatar = { originalName: f.originalname, mime: f.mimetype, size: f.size, path: f.path, url };
  const doc = await Onboarding.findOneAndUpdate(
    { userId }, { $set: { profilePicture: avatar } }, { new: true, upsert: true }
  );
  res.json(doc.profilePicture);
});

/** 上传普通文件（带 label） */
router.post('/me/upload', upload.single('file'), async (req, res) => {
  const userId = getUserId(req);
  const { label = 'generic' } = req.body;
  const f = req.file;
  const url = `/api/files/raw/${f.filename}`;
  const item = { label, originalName: f.originalname, mime: f.mimetype, size: f.size, path: f.path, url };
  await Onboarding.findOneAndUpdate(
    { userId }, { $push: { documents: item } }, { new: true, upsert: true }
  );
  res.json(item);
});

export default router;
