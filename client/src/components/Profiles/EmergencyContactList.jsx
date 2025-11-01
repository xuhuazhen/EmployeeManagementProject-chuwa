import React from "react";
import { Form, Input, Button, Card, Divider, Space } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const PHONE_RE = /^\d{3}-?\d{3}-?\d{4}$/;

export default function EmergencyContactList({ form, readOnly = false }) {
  return (
    <>
      <Divider orientation="left">Emergency Contacts (1+)</Divider>

      <Form.List
        name="emergencyContact"
        rules={[
          {
            validator: async (_, contacts) => {
              if (!contacts || contacts.length < 1) {
                return Promise.reject(new Error("At least one emergency contact is required"));
              }
            },
          },
        ]}
      >
{(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, idx) => (
              <Card
                key={field.key} // 使用 field.key 保证唯一
                size="small"
                title={`Contact #${idx + 1}`}
                style={{ marginBottom: 12 }}
                extra={
                  !readOnly && fields.length > 1 ? (
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(field.name)}
                    >
                      Remove
                    </Button>
                  ) : null
                }
              >
                <Space size="large" wrap>
                  <Form.Item
                    label="First Name"
                    name={[field.name, "firstName"]}
                    rules={[{ required: true, message: "First name is required" }]}
                  >
                    <Input style={{ width: 260 }} readOnly={readOnly} />
                  </Form.Item>

                  <Form.Item
                    label="Last Name"
                    name={[field.name, "lastName"]}
                    rules={[{ required: true, message: "Last name is required" }]}
                  >
                    <Input style={{ width: 260 }} readOnly={readOnly} />
                  </Form.Item>

                  <Form.Item label="Middle Name" name={[field.name, "middleName"]}>
                    <Input style={{ width: 260 }} readOnly={readOnly} />
                  </Form.Item>
                </Space>

                <Space size="large" wrap>
                  <Form.Item
                    label="Phone"
                    name={[field.name, "phone"]}
                    rules={[
                      { required: true, message: "Phone is required" },
                      { pattern: PHONE_RE, message: "Invalid phone number" },
                    ]}
                  >
                    <Input style={{ width: 260 }} readOnly={readOnly} />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name={[field.name, "email"]}
                    rules={[
                      { required: true, message: "Email is required" },
                      { type: "email", message: "Invalid email" },
                    ]}
                  >
                    <Input style={{ width: 260 }} readOnly={readOnly} />
                  </Form.Item>

                  <Form.Item
                    label="Relationship"
                    name={[field.name, "relationship"]}
                    rules={[{ required: true, message: "Relationship is required" }]}
                  >
                    <Input style={{ width: 260 }} readOnly={readOnly} />
                  </Form.Item>
                </Space>
              </Card>
            ))}

            <Form.ErrorList errors={errors} />
            {!readOnly && (
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
                style={{ width: "100%" }}
              >
                Add Emergency Contact
              </Button>
            )}
          </>
        )}
      </Form.List>
    </>
  );
}