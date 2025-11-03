// client/src/api/onboardingApi.js
import api from "./axiosConfig";

// ------- 文件上传（保持你之前的路由风格） -------
export const uploadAvatar = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  console.log(file)
  return api.post("/file/upload/avatar", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const uploadDocument = (file, label) => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append('tag', label);
  // 服务端按 query.label 识别文档类型（driver-license / opt-receipt / ead / i-983 / i-20）
  return api.post('/file/upload', fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ------- Onboarding 读/写 -------
export const getOnboardingMe = () => api.get("/onboarding/me");

export const saveOnboardingMe = (payload) =>
  api.post("/onboarding/me", payload);

// ------- 把表单值构造成「嵌套结构」匹配后端 User 模型 -------
/**
 * 注意：这里的键名严格匹配你的后端 User 模型
 * - personalInfo: { firstName, lastName, middleName, preferredName, ssn, dateOfBirth, gender }
 * - address: { address1, address2, city, state, zip }
 * - contactInfo: { cellPhoneNumber, workPhoneNumber }
 * - employment: { visaTitle, isF1, startDate, endDate }
 * - reference: { firstName, lastName, phone, email, relationship }
 * - emergencyContact: [ { firstName, lastName, middleName, phone, email, relationship } ]
 */
export const buildOnboardingPayload = (v) => ({
  personalInfo: {
    firstName: v.firstName || "",
    lastName: v.lastName || "",
    middleName: v.middleName || "",
    preferredName: v.preferredName || "",
    ssn: v.ssn || "",
    dateOfBirth: v.dateOfBirth || null, // 你在 onFinish 里已格式化为 YYYY-MM-DD
    gender: v.gender || "",
  },
  address: {
    address1: v.address1 || "",
    address2: v.address2 || "",
    city: v.city || "",
    state: v.state || "",
    zip: v.zip || "",
  },
  contactInfo: {
    cellPhoneNumber: v.cellPhone || "",
    workPhoneNumber: v.workPhone || "",
  },
  employment: {
    visaTitle:
      v.visaType === "f1-opt" ? "F1 (OPT)" :
      v.visaType === "h1b" ? "H1-B" :
      v.visaType === "h4" ? "H4" :
      v.visaType === "citizen" ? "Citizen" :
      v.visaType === "green-card" ? "Green Card" :
      (v.otherVisaTitle || v.visaType || ""),
    isF1: v.visaType === "f1-opt",
    startDate: v.workAuthStartDate || null,
    endDate: v.workAuthEndDate || null,
  },
  reference: {
    firstName: v.refFirstName || "",
    lastName: v.refLastName || "",
    phone: v.refPhone || "",
    email: v.refEmail || "",
    relationship: v.refRelationship || "",
  },
  emergencyContact: Array.isArray(v.emergencyContacts)
    ? v.emergencyContacts
    : [],
});
