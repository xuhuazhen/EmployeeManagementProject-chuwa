import axios from "axios";

const BASE_URL = "http://localhost:3000/api/hr";

export const fetchAllEmployeesAPI = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await axios.get(`${BASE_URL}/profiles?${queryString}`);
  return res.data.data;
};

export const updateDocumentStatusAPI = async ({ docId, status, feedback }) => {
  const res = await axios.patch(`${BASE_URL}/documents/${docId}`, {
    status,
    feedback,
  });
  return res.data.data;
};
export const sendNotificationAPI = async ({ employeeId, message }) => {
  const res = await axios.post(`${BASE_URL}/send-notification`, {
    employeeId,
    message,
  });
  return res.data.data;
};

export const getEmailHistoryAPI = async () => {
  const res = await axios.get(`${BASE_URL}/history`);
  return res.data.data;
};
