import React from "react";
import { Form, Input, Divider, Space, Radio } from "antd";

const PHONE_RE = /^\d{3}-?\d{3}-?\d{4}$/;

export default function ReferenceCard({ form, readOnly = false }) { 

  const reference  = Form.useWatch("reference", form);
  const hasReference =
    reference &&
    Object.keys(reference).some(
      (key) => reference[key] !== null && reference[key] !== ""
    );

    if (!hasReference) {
    return (
      <>
        <Divider orientation="left">Reference (Referral)</Divider>
        <div>No referral</div>
      </>
    );
  }

  return (
    <>
      <Divider orientation="left">Reference (Referral)</Divider> 

          <Space size="large" wrap>
            <Form.Item
              label="First Name"
              name={["referral", "firstName"]}
              rules={[{ required: !readOnly, message: "Referral first name is required" }]}
            >
              <Input style={{ width: 300 }} readOnly={readOnly} />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name={["referral", "lastName"]}
              rules={[{ required: !readOnly, message: "Referral last name is required" }]}
            >
              <Input style={{ width: 300 }} readOnly={readOnly} />
            </Form.Item>
            <Form.Item
              label="Email"
              name={["referral", "email"]}
              rules={[
                { required: !readOnly, message: "Referral email is required" },
                { type: "email", message: "Invalid email" },
              ]}
            >
              <Input style={{ width: 320 }} readOnly={readOnly} />
            </Form.Item>
          </Space>

          <Space size="large" wrap>
            <Form.Item
              label="Phone"
              name={["referral", "phone"]}
              rules={[
                { required: !readOnly, message: "Referral phone is required" },
                { pattern: PHONE_RE, message: "Invalid phone number" },
              ]}
            >
              <Input style={{ width: 300 }} readOnly={readOnly} />
            </Form.Item>
            <Form.Item
              label="Relationship"
              name={["referral", "relationship"]}
              rules={[{ required: !readOnly, message: "Relationship is required" }]}
            >
              <Input
                style={{ width: 300 }}
                placeholder="ex: Manager / Colleague"
                readOnly={readOnly}
              />
            </Form.Item>
          </Space> 
    </>
  );
}
