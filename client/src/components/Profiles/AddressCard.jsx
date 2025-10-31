import React from "react";
import { Form, Input, Space, Divider } from "antd";

export const AddressCard = ({ form, readOnly }) => {
    const ZIP_RE = /^\d{5}(-\d{4})?$/;
 
    return (
    <>
      <Divider orientation="left">Address</Divider>
      <Space size="large" wrap>
        <Form.Item
          label="Address 1"
          name={["address", "address1"]}
          rules={[{ required: !readOnly, message: "Address 1 is required" }]}
        >
          <Input
            style={{ width: 300 }}
            placeholder="Enter address line 1"
            readOnly={readOnly}
          />
        </Form.Item>

        <Form.Item
          label="Address 2"
          name={["address", "address2"]}
        >
          <Input
            style={{ width: 300 }}
            placeholder="Enter address line 2"
            readOnly={readOnly}
          />
        </Form.Item>

        <Form.Item
          label="City"
          name={["address", "city"]}
          rules={[{ required: !readOnly, message: "City is required" }]}
        >
          <Input
            style={{ width: 300 }}
            placeholder="Enter city"
            readOnly={readOnly}
          />
        </Form.Item>

        <Form.Item
          label="State"
          name={["address", "state"]}
          rules={[{ required: !readOnly, message: "State is required" }]}
        >
          <Input
            style={{ width: 300 }}
            placeholder="Enter state"
            readOnly={readOnly}
          />
        </Form.Item>

        <Form.Item
          label="Zip"
          name={["address", "zip"]}
          rules={[{ required: !readOnly, message: "Zip code is required" }
            ,{ pattern: ZIP_RE, message: "Invalid ZIP code" }]}
        >
          <Input
            style={{ width: 300 }}
            placeholder="Enter zip code"
            readOnly={readOnly}
          />
        </Form.Item>
      </Space>
    </>
  );
}
