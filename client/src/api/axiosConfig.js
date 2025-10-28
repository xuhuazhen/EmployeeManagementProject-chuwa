import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",   // 统一指向后端
  withCredentials: true,                   // 携带 cookie（和后端 Session/Token 配合）
  headers: { "Content-Type": "application/json" },
});
  
export default api;
