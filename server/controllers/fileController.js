import { User, Document } from '../models/User.js';
import { AppError } from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import path from 'path';
import fs from 'fs';

const getUserId = (req) => req.headers['x-demo-userid'] || 'user-0001';

/** 预览（浏览器直接打开） */
export const get_preview = catchAsync(async (req, res, next) => {
  const p = path.join(process.cwd(), 'uploads', req.params.name);
  if (!fs.existsSync(p)) return res.sendStatus(404);
  res.sendFile(p);
});

/** 下载（触发保存框） */
export const get_download = catchAsync(async (req, res, next) => {
  const p = path.join(process.cwd(), 'uploads', req.params.name);
  if (!fs.existsSync(p)) return res.sendStatus(404);
  res.download(p);
});

/** 上传头像 */
export const post_Avatar = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);
//   const userId = req.user.userId;
  const f = req.file;
  const url = `/uploads/${f.filename}`;

  const doc = await Document.create({
    url,
    title: f.originalname,
    tag: 'profile-picture',
    status: undefined
  });

  await User.findByIdAndUpdate(userId, { $push: { documents: doc._id } });
  res.json(doc);
});

/** 上传普通文件（带 label） */
export const post_document = catchAsync(async (req, res, next) => {
  console.log('req.file:', req.file);
  console.log('user:', req.user); 
  const userId = req.user.userId;
  const tag = req.body.tag;

  //检查是否用户存在
  const user = await User.findById(userId).populate('documents'); 
  if (!user) {
    return next(new AppError('No user found', 404));
  }

  const f = req.file;  
  const url = `/api/files/raw/${f.filename}`;

   const newDocument = await Document.create({
    url,
    title: req.file.originalname,
    tag,
    status: undefined,
  });

  const docId = await user.getDocIdByTag(tag);
  console.log('new doc:', docId)
  //检查用户是否已经提交过文件，是则删除旧文件
  if (docId) {
    user.documents = user.documents.filter((doc) => doc.tag !== tag);
    await Document.deleteOne({ _id: docId });
  }

  user.documents.push(newDocument);
  //文件提交后，对应的状态都要改回pending
  if (['ead', 'i20', 'i983'].includes(tag)) {
    newDocument.status = 'pending';
    user.nextStep = `${tag}-pending`;
  }

  await user.save();
  await newDocument.save();
  res.status(201).json({
    status: 'success',
    data: {
      _id: newDocument._id,
      url, 
      title: req.file.originalname,
      tag,
      nextStep: user.nextStep,
    },
  });
});
