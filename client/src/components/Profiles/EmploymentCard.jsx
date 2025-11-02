// src/components/Profiles/EmploymentCard.jsx
import React from "react";
import { Form, Divider, DatePicker, Space } from "antd";
import dayjs from "dayjs";

export const EmploymentCard = ({ form, readOnly }) => {
  const validateStartDate = (_, value) => {
    const endDate = form.getFieldValue(["employment", "endDate"]);
    if (endDate && value && dayjs(value).isAfter(dayjs(endDate))) {
      return Promise.reject(new Error("Start date cannot be after end date"));
    }
    return Promise.resolve();
  };

  const validateEndDate = (_, value) => {
    const startDate = form.getFieldValue(["employment", "startDate"]);
    if (startDate && value && dayjs(value).isBefore(dayjs(startDate))) {
      return Promise.reject(new Error("End date cannot be before start date"));
    }
    return Promise.resolve();
  };

  return (
    <>
      <Divider orientation="left">Employment Info</Divider>
      <Space size="large" wrap>
        <Form.Item
          label="Start Date"
          name={["employment", "startDate"]}
          rules={[
            { required: !readOnly, message: "Please select start date" },
            { validator: validateStartDate },
          ]}
        >
          <DatePicker style={{ width: 300 }} disabled={readOnly} />
        </Form.Item>

        <Form.Item
          label="End Date"
          name={["employment", "endDate"]}
          rules={[
            { required: !readOnly, message: "Please select end date" },
            { validator: validateEndDate },
          ]}
        >
          <DatePicker style={{ width: 300 }} disabled={readOnly} />
        </Form.Item>
      </Space>
    </>
  );
};

export default EmploymentCard;
