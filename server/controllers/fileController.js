import { User, Document } from '../models/User.js';
import { AppError } from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import path from 'path';
import fs from 'fs';

const getUserKey = (req) => req.headers['x-demo-userid'] || 'user-0001';

// 统一把 label 正规化成模型允许的 tag
// 模型里是: "profile-picture","driver-license","opt-receipt","ead","i983","i20"
const normalizeLabel = (label) => {
  if (!label) return null;
  const s = String(label).toLowerCase();
  if (s === 'driver-license' || s === 'driver_license') return 'driver-license';
  if (s === 'opt-receipt' || s === 'opt_receipt') return 'opt-receipt';
  if (s === 'ead') return 'ead';
  if (s === 'i-983' || s === 'i983') return 'i983';
  if (s === 'i-20' || s === 'i20') return 'i20';
  if (s === 'avatar' || s === 'profile' || s === 'profile-picture') return 'profile-picture';
  return null;
};

// 让浏览器能访问到本地文件
const makePublicUrl = (filename) => `/api/files/raw/${filename}`;

/** 预览（浏览器直接打开） */
export const get_preview = catchAsync(async (req, res) => {
  const p = path.join(process.cwd(), 'uploads', req.params.name);
  if (!fs.existsSync(p)) return res.sendStatus(404);
  res.sendFile(p);
});

/** 下载（触发保存框） */
export const get_download = catchAsync(async (req, res) => {
  const p = path.join(process.cwd(), 'uploads', req.params.name);
  if (!fs.existsSync(p)) return res.sendStatus(404);
  res.download(p);
});

/** 上传头像：POST /api/file/upload/avatar */
export const post_Avatar = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded', 400));

  // 这里一定不能用 findById；X-Demo-Userid 是 username
  const username = getUserKey(req);
  const user = await User.findOne({ username });
  if (!user) return next(new AppError('User not found', 404));

  const url = makePublicUrl(req.file.filename);

  // upsert Document(tag='profile-picture')
  let doc = await Document.findOne({ _id: { $in: user.documents }, tag: 'profile-picture' });
  if (doc) {
    doc.url = url;
    doc.status = 'pending';
    await doc.save();
  } else {
    doc = await Document.create({
      url,
      title: req.file.originalname,
      tag: 'profile-picture',
      status: 'pending',
    });
    user.documents.push(doc._id);
  }

  await user.save();
  res.json({ _id: doc._id, url, tag: 'profile-picture' });
});

/** 上传普通文件：POST /api/file/upload?label=xxx */
export const post_document = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded', 400));

  // 兼容 query.label / body.tag 两种写法
  const raw = req.query.label || req.body.tag;
  const tag = normalizeLabel(raw);
  if (!tag) return next(new AppError(`Invalid label: ${raw}`, 400));

  const username = getUserKey(req);
  const user = await User.findOne({ username }).populate('documents');
  if (!user) return next(new AppError('User not found', 404));

  const url = makePublicUrl(req.file.filename);

  // 如果已有同标签文档，删除旧的，替换成最新
  const existed = user.documents.find((d) => d.tag === tag);
  if (existed) {
    await Document.deleteOne({ _id: existed._id });
    user.documents = user.documents.filter((d) => d.tag !== tag);
  }

  const newDocument = await Document.create({
    url,
    title: req.file.originalname,
    tag,
    status: 'pending',
  });

  user.documents.push(newDocument._id);

  // 提交这三类文档时，推进流程
  if (['ead', 'i20', 'i983'].includes(tag)) {
    user.nextStep = `${tag}-pending`;
  }

  await user.save();

  res.status(201).json({
    status: 'success',
    data: {
      _id: newDocument._id,
      url,
      title: newDocument.title,
      tag,
      nextStep: user.nextStep,
    },
  });
});
