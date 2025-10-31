// client/src/api/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// 开发阶段：用请求头模拟登录身份（和后端一致）
// api.interceptors.request.use((config) => {
//   config.headers["X-Demo-Userid"] = "user-0001";
//   return config;
// });

export default api;
