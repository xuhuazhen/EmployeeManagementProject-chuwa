import { Router } from 'express';
import { upload } from '../utils/uploadConfig.js';
import {
  get_preview,
  get_download,
  post_Avatar,
  post_document
} from '../controllers/fileController.js';

const router = Router();

// 文件预览（直接打开）
router.get('/raw/:name', get_preview);

// 文件下载（触发下载）
router.get('/download/:name', get_download);

// 上传头像
router.post('/avatar', upload.single('file'), post_Avatar);

// 上传普通文档
router.post('/upload', upload.single('file'), post_document);

export default router;
