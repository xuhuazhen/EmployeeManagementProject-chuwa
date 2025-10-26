import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['employee', 'hr'],
      default: 'employee',
      required: true,
    },
});

export const User = mongoose.model('User', UserSchema, 'users'); 
