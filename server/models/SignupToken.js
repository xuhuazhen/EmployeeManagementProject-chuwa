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

// Static method to find a SignupToken by email and token and update its status to completed
SignupTokenSchema.statics.markAsCompleted = async function (email, token) {
  return await this.findOneAndUpdate(
    { email, token },
    { $set: { status: 'completed' } },
    { new: true }
  );
};

export const SignupToken = mongoose.model(
  'SignupToken',
  SignupTokenSchema,
  'signupToken'
);
