// server/models/Onboarding.js
import mongoose from 'mongoose';

const DocSchema = new mongoose.Schema({
  label: String,                // 文件类别（driver_license/work_auth/generic等）
  originalName: String,
  mime: String,
  size: Number,
  path: String,
  url: String                   // /api/files/raw/<文件名>
}, { _id: false });

const OnboardingSchema = new mongoose.Schema({
  userId: { type: String, index: true, unique: true }, // 简化：用字符串当 userId
  firstName: String,
  lastName: String,
  email: String,
  workAuth: { title: String, start: Date, end: Date },

  profilePicture: { originalName: String, mime: String, size: Number, path: String, url: String },
  documents: [DocSchema],

  status: { type: String, enum: ['NEVER_SUBMITTED','PENDING','APPROVED','REJECTED'], default: 'NEVER_SUBMITTED' },
  feedback: String
}, { timestamps: true });

export default mongoose.model('Onboarding', OnboardingSchema);
