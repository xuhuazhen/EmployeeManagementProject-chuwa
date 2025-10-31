// server/controllers/onboardingController.js
import { User } from "../models/User.js";

// 用请求头模拟登录（开发环境）
const getUserKey = (req) => req.headers["x-demo-userid"] || "user-0001";

// GET /api/onboarding/me
export const get_Onboarding = async (req, res, next) => {
  try {
    const key = getUserKey(req);

    // demo 约定：用 username = user-0001
    let user = await User.findOne({ username: key }).populate("documents");
    if (!user) return res.status(404).json({ status: "fail", message: "User not found" });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// POST /api/onboarding/me
export const save_Onboarding = async (req, res, next) => {
  try {
    const key = getUserKey(req);

    // 确保用户存在（如果你已用 seed 脚本，就一定能找到）
    let user = await User.findOne({ username: key });
    if (!user) {
      user = await User.create({
        username: key,
        email: `${key}@demo.local`,
        password: "temp1234",
        role: "employee",
      });
    }

    const {
      personalInfo = {},
      address = {},
      contactInfo = {},
      employment = {},
      reference = {},
      emergencyContact = [],
    } = req.body || {};

    // 写入嵌套对象（与模型字段一致）
    user.personalInfo = {
      firstName: personalInfo.firstName || "",
      lastName: personalInfo.lastName || "",
      middleName: personalInfo.middleName || "",
      preferredName: personalInfo.preferredName || "",
      ssn: personalInfo.ssn || "",
      dateOfBirth: personalInfo.dateOfBirth || null,
      gender: personalInfo.gender || "",
    };

    user.address = {
      address1: address.address1 || "",
      address2: address.address2 || "",
      city: address.city || "",
      state: address.state || "",
      zip: address.zip || "",
    };

    user.contactInfo = {
      cellPhoneNumber: contactInfo.cellPhoneNumber || "",
      workPhoneNumber: contactInfo.workPhoneNumber || "",
    };

    user.employment = {
      visaTitle: employment.visaTitle || "",
      startDate: employment.startDate || null,
      endDate: employment.endDate || null,
      isF1: !!employment.isF1,
    };

    user.reference = {
      firstName: reference.firstName || "",
      lastName: reference.lastName || "",
      phone: reference.phone || "",
      email: reference.email || "",
      relationship: reference.relationship || "",
    };

    user.emergencyContact = Array.isArray(emergencyContact) ? emergencyContact : [];

    // 提交后把状态置为 pending（可按需保留/删除）
    user.application = { status: "pending" };
    user.nextStep = "application-pending";

    await user.save();

    res.json(user);
  } catch (err) {
    next(err);
  }
};
