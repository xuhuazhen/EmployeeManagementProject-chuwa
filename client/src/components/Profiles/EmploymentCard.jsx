import React from "react";
import { Form, Select, Input, Divider, DatePicker, Space } from "antd"; 
import { useEffect } from "react";
import dayjs from 'dayjs';

const { Option } = Select;

export const EmploymentCard = ({ form, readOnly }) => {
  const handleVisaChange = (value) => {
    if (value === "F1") {
      form.setFieldsValue({
        employment: { ...form.getFieldValue("employment"), isF1: true, visaTitle: value },
      });
    } else if (value === "other") {
      form.setFieldsValue({
        employment: { ...form.getFieldValue("employment"), isF1: false, visaTitle: value },
      });
    } else {
      form.setFieldsValue({
        employment: { ...form.getFieldValue("employment"), isF1: false, visaTitle: value },
      });
      console.log(form.getFieldValue('employment'));
    }
  };

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
  

  const visaTitleValue = Form.useWatch(["employment", "visaTitle"], form);

  return (
    <>
      <Divider orientation="left">Employment Info</Divider>
       <Space size="large" wrap>
        <Form.Item
          label="Visa Title"
          name={["employment", "visaTitle"]}
          rules={[{ required: !readOnly, message: "Please select visa title" }]}
        >
          <Select
            style={{ width: 300 }}
            placeholder="Select"
            onChange={handleVisaChange}
            disabled={readOnly}
              value={
                ["F1", "F1(CPT/OPT)", "f1-opt"].includes(form.getFieldValue(["employment", "visaTitle"]))
                  ? "F1"
                  : form.getFieldValue(["employment", "visaTitle"])
              }
          >
            <Option value="">Select</Option>
            <Option value="H1-B">H1-B</Option>
            <Option value="L2">L2</Option>
            <Option value="F1">F1(CPT/OPT)</Option>
            <Option value="H4">H4</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        {visaTitleValue === "other" && (
          <Form.Item
            label="Custom Visa Title"
            name={["employment", "visaTitleCustom"]}
            rules={[{ required: !readOnly, message: "Please enter visa title" }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="Enter visa title"
              readOnly={readOnly}
            />
          </Form.Item>
        )}
 
            <Form.Item
              label="Start Date"
              name={["employment", "startDate"]}
              rules={[
                { required: !readOnly, message: "Please select start date" },
                { validator: validateStartDate },
              ]}
            >
              <DatePicker
                style={{ width: 300 }}
                disabled={readOnly}
              />
            </Form.Item>

            <Form.Item
              label="End Date"
              name={["employment", "endDate"]}
              rules={[
                { required: !readOnly, message: "Please select end date" },
                { validator: validateEndDate },
              ]}
            >
              <DatePicker
                style={{ width: 300 }}
                disabled={readOnly}
              />
            </Form.Item>  
      </Space>
    </>
  );
}
