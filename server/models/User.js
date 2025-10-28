// server/models/User.js
import mongoose from 'mongoose';
import argon2 from 'argon2'; // ESM 默认导入

const { Schema } = mongoose;

/* ---------- 子文档 Schemas ---------- */
const PersonalInfoSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    middleName: String,
    preferredName: String,
    ssn: String,
    dateOfBirth: Date,
    gender: String,
  },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
  },
  { _id: false }
);

const ContactInfoSchema = new Schema(
  {
    cellPhoneNumber: String,
    workPhoneNumber: String,
  },
  { _id: false }
);

const EmploymentSchema = new Schema(
  {
    visaTitle: String,
    startDate: Date,
    endDate: Date,
    isF1: Boolean,
  },
  { _id: false }
);

const ContactsSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    middleName: String,
    phone: String,
    email: String,
    relationship: String,
  },
  { _id: false }
);

const ApplicationSchema = new Schema(
  {
    status: {
      type: String,
      enum: ['waiting', 'pending', 'approved', 'rejected'],
      default: 'waiting',
      required: true,
    },
    feedback: String,
  },
  { _id: false }
);

const DocumentSchema = new Schema(
  {
    url: String,
    title: String,
    tag: {
      type: String,
      enum: [
        'profile-picture',
        'driver-license',
        'opt-receipt',
        'ead',
        'i983',
        'i20',
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
    },
    feedback: String,
  },
  { versionKey: false }
);

/* ---------- 用户主 Schema（先定义，再挂中间件/方法） ---------- */
const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }, // 取时需要 .select('+password')
    role: { type: String, enum: ['employee', 'hr'], default: 'employee', required: true },

    nextStep: {
      type: String,
      enum: [
        'application-waiting', 'application-pending', 'application-reject',
        'ead-waiting', 'ead-pending', 'ead-reject',
        'i20-waiting', 'i20-pending', 'i20-reject',
        'i983-waiting', 'i983-pending', 'i983-reject',
        'all-done',
      ],
      default: 'application-waiting',
      required: true,
    },

    personalInfo: PersonalInfoSchema,
    address: AddressSchema,
    contactInfo: ContactInfoSchema,
    employment: EmploymentSchema,
    reference: ContactsSchema,
    emergencyContact: [ContactsSchema],
    application: { type: ApplicationSchema, default: () => ({}) },

    // 你这里引用了独立的 Document 模型（下面会导出）
    documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
  },
  { timestamps: true }
);

/* ---------- Hooks & Methods（必须放在定义之后） ---------- */

// 保存前哈希密码（仅当 password 被修改时）
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await argon2.hash(this.password);
  next();
});

// 实例方法：校验明文密码
UserSchema.methods.correctPassword = function (candidatePassword) {
  // this.password 为数据库中的 hash（需要查询时显式 select('+password')）
  return argon2.verify(this.password, candidatePassword);
};

/* ---------- 模型导出 ---------- */
export const User = mongoose.model('User', UserSchema, 'user');
export const Document = mongoose.model('Document', DocumentSchema, 'document');
