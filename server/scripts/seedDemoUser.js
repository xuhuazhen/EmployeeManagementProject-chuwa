import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

const MONGO = process.env.DATABASE?.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

async function main() {
  await mongoose.connect(MONGO);
  console.log('Mongo connected');

  // 和前端 axios 头保持一致
  const demoId = 'user-0001';

  // 你模型里 username 是唯一必填，我们用 demoId 当 username，email 随便给一个可读的
  const exists = await User.findOne({ username: demoId }).select('_id');
  if (exists) {
    console.log('Demo user already exists:', demoId);
  } else {
    await User.create({
      username: demoId,
      email: 'demo+user0001@example.com',
      password: 'Temp1234!',
      role: 'employee',
      nextStep: 'application-waiting',
      personalInfo: {}, address: {}, contactInfo: {}, employment: {}, emergencyContact: []
    });
    console.log('Demo user created:', demoId);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
