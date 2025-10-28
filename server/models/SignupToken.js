import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const SignupTokenSchema = new Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true },
    personName: String,
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
  },
  { versionKey: false }
);

export const SignupToken = mongoose.model(
  'SignupToken',
  SignupTokenSchema,
  'signupToken'
);
