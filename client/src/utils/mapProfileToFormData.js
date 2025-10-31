import dayjs from "dayjs";

export const mapProfileToFormData = (data) => {
  if (!data) return null;

  return {
    email: data.email,
    address: data.address,
    contactInfo: data.contactInfo,
    employment: {
      ...data.employment,
      startDate: data.employment?.startDate ? dayjs(data.employment.startDate) : null,
      endDate: data.employment?.endDate ? dayjs(data.employment.endDate) : null,
    },
    reference: data.reference,
    emergencyContact: data.emergencyContact,
    documents: data.documents,
    personalInfo: {
      ...data.personalInfo,
      dateOfBirth: data.personalInfo?.dateOfBirth ? dayjs(data.personalInfo.dateOfBirth) : null,
    },
  };
}
