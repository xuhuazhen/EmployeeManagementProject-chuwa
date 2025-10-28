import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';

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

export const upload = multer({ storage });