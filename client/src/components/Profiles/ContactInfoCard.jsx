import React from "react";
import { Form, Input, Space, Divider } from "antd";

export const ContactInfoCard = ({ form, readOnly }) => {
    const PHONE_RE = /^\+?1?[-. (]*\d{3}[-. )]*\d{3}[-. ]*\d{4}$/; // 宽松的北美电话

    return (
    <>
        <Divider orientation="left">Contact Info</Divider>
        <Space size="large" wrap>
          <Form.Item
            label="Cell Phone"
            name={["contactInfo", "cellPhoneNumber"]}
            rules={[
              { required: !readOnly, message: "Cell phone is required" },
              { pattern: PHONE_RE, message: "Invalid phone number" },
            ]}
          >
            <Input style={{ width: 300 }} placeholder="+1 617-xxx-xxxx" />
          </Form.Item>
          <Form.Item
            label="Work Phone"
            name={["contactInfo", "workPhoneNumber"]}
            readOnly={readOnly}
            rules={[{ pattern: PHONE_RE, message: "Invalid phone number" }]}
          >
            <Input style={{ width: 300 }} placeholder="+1 617-xxx-xxxx" />
          </Form.Item>
        </Space>
    </>
    )
};