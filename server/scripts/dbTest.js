import 'dotenv/config';
import mongoose from 'mongoose';

const raw = process.env.MONGODB_URI
  || (process.env.DATABASE?.replace('<PASSWORD>', encodeURIComponent(process.env.DATABASE_PASSWORD || '')));

if (!raw) {
  console.error('❌ 没有可用的 Mongo 连接串，请检查 .env');
  process.exit(1);
}

try {
  const conn = await mongoose.connect(raw);
  console.log('✅ 已连接 MongoDB：', conn.connection.host, conn.connection.name);
  await mongoose.disconnect();
  console.log('✅ 已正常断开连接');
  process.exit(0);
} catch (e) {
  console.error('❌ 连接失败：', e.message);
  console.error('   排查：密码/用户名是否正确；密码是否已 URL 编码；库名是否一致；Atlas 是否放行 IP');
  process.exit(2);
}
