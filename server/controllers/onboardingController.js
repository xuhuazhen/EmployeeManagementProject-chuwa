import { User, Document } from '../models/User.js';

// 临时“登录”：用请求头模拟 userId（前端或 Postman 加 x-demo-userid）
const getUserId = (req) => req.headers['x-demo-userid'] || 'user-0001';

/** 获取我的 Onboarding */
export const get_Onboarding = async (req, res) => {
  const userId = getUserId(req);
  const user = await User.findById(userId).populate('documents');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

/** 提交/更新表单（今天：提交即置为 PENDING） */
export const update_Onboarding = async (req, res) => {
  const userId = getUserId(req);
  const {
    personalInfo,
    address,
    contactInfo,
    employment,
    reference,
    emergencyContact
  } = req.body;

  const update = {
    personalInfo,
    address,
    contactInfo,
    employment,
    reference,
    emergencyContact,
    'application.status': 'pending'
  };

  const user = await User.findByIdAndUpdate(userId, update, {
    new: true,
    upsert: true
  }).populate('documents');

  res.json(user);
};