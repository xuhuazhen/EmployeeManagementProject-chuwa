// src/utils/mapProfileToFormData.js
import dayjs from "dayjs";

export const mapProfileToFormData = (data) => {
  // 确保不会因为 data 为空而报错
  if (!data) return {};

  // ===== employment / visa 映射：把后端各种字符串统一成前端用的枚举 =====
  const rawEmployment = data.employment || {};
  const rawVisaTitle = rawEmployment.visaTitle || "";
  const visaLower = rawVisaTitle.toLowerCase().trim();

  let normalizedVisaTitle;
  if (!rawVisaTitle) {
    normalizedVisaTitle = undefined;
  } else if (visaLower.includes("citizen")) {
    // "Citizen" / "US Citizen" / "U.S. citizen" -> "citizen"
    normalizedVisaTitle = "citizen";
  } else if (visaLower.includes("green") && visaLower.includes("card")) {
    // "Green Card" / "green card" -> "green-card"
    normalizedVisaTitle = "green-card";
  } else if (visaLower.includes("f1")) {
    // "F1" / "F1 (OPT)" -> "F1"
    normalizedVisaTitle = "F1";
  } else if (visaLower.includes("h1")) {
    normalizedVisaTitle = "h1b";
  } else if (visaLower.includes("l2")) {
    normalizedVisaTitle = "l2";
  } else if (visaLower.includes("h4")) {
    normalizedVisaTitle = "h4";
  } else {
    // 其他保持原样，交给 StatusSelector 自己处理
    normalizedVisaTitle = rawVisaTitle;
  }

  // ===== emergencyContact：保证至少有一条空记录，方便第一次填写 =====
  let emergencyContact = Array.isArray(data.emergencyContact)
    ? data.emergencyContact
    : [];

  if (emergencyContact.length === 0) {
    emergencyContact = [
      {
        firstName: "",
        lastName: "",
        middleName: "",
        phone: "",
        email: "",
        relationship: "",
      },
    ];
  }

  return {
    email: data.email || "",
    address: data.address || null,
    contactInfo: data.contactInfo || null,

    employment: {
      ...rawEmployment,
      visaTitle: normalizedVisaTitle,
      startDate: rawEmployment.startDate
        ? dayjs(rawEmployment.startDate)
        : null,
      endDate: rawEmployment.endDate ? dayjs(rawEmployment.endDate) : null,
    },

    reference: data.reference || null,
    emergencyContact,
    documents: data.documents || [],

    personalInfo: {
      ...(data.personalInfo || {}),
      dateOfBirth: data.personalInfo?.dateOfBirth
        ? dayjs(data.personalInfo.dateOfBirth)
        : null,
    },
  };
};