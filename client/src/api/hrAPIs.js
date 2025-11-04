import axios from "axios";

const BASE_URL = "http://localhost:3000/api/hr";

export const fetchAllEmployeesAPI = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await axios.get(`${BASE_URL}/profiles?${queryString}`, 
    { withCredentials: true } // 这是配置项
  );
  return res.data.data;
};

export const updateDocumentStatusAPI = async ({ userId, docId, status, feedback }) => {
  const res = await axios.patch(`${BASE_URL}/documents/${docId}`, {
    userId,
    status,
    feedback,
  },
  { withCredentials: true } // 这是配置项
);
  return res.data.data;
};

export const sendNotificationAPI = async ({ employeeId }) => {
  console.log(employeeId);
  const res = await axios.post(`${BASE_URL}/notify/${employeeId}`, {},
    { withCredentials: true } // 这是配置项
  );
  return res.data.data;
};

export const getEmailHistoryAPI = async () => {
  const res = await axios.get(`${BASE_URL}/history`,
    { withCredentials: true } // 这是配置项
  );
  return res.data.data;
};
