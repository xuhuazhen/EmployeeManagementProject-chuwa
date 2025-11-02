import React from "react";
import { Form, Radio, Select, Divider, Space, Input } from "antd";

const { Option } = Select;

export default function StatusSelector({ form, readOnly = false }) {
  const usPerson = Form.useWatch(["employment", "usPerson"], form);
  const prType = Form.useWatch(["employment", "prType"], form);
  const visaTitle = Form.useWatch(["employment", "visaTitle"], form);

  const onUSPersonChange = (e) => {
    const val = e.target.value; // true | false
    if (val) {
      // 选择 US Person 时，清空签证字段
      form.setFieldsValue({
        employment: {
          ...form.getFieldValue("employment"),
          usPerson: true,
          prType: prType || undefined,
          visaTitle: undefined,
          visaType: undefined,
          visaTitleCustom: undefined,
        },
      });
    } else {
      // 非 US Person，清空 prType
      form.setFieldsValue({
        employment: {
          ...form.getFieldValue("employment"),
          usPerson: false,
          prType: undefined,
        },
      });
    }
  };

  const onPRTypeChange = (val) => {
    form.setFieldsValue({
      employment: {
        ...form.getFieldValue("employment"),
        prType: val, // 'citizen' | 'green-card'
      },
    });
  };

  const onVisaChange = (val) => {
    form.setFieldsValue({
      employment: {
        ...form.getFieldValue("employment"),
        visaTitle: val, // "F1" | "H1-B" | "L2" | "H4" | "other"
        visaType:
          val === "F1" ? "f1-opt"
          : val === "H1-B" ? "h1b"
          : val === "L2" ? "l2"
          : val === "H4" ? "h4"
          : val === "other" ? "other"
          : undefined,
        // 清理自定义签证名，当切回非 other
        ...(val !== "other" ? { visaTitleCustom: undefined } : {}),
      },
    });
  };

  return (
    <>
      <Divider orientation="left">Status</Divider>

      <Form.Item
        label="Are you a U.S. person (Citizen/Green Card)?"
        name={["employment", "usPerson"]}
        rules={[{ required: !readOnly, message: "Please select one" }]}
      >
        <Radio.Group onChange={onUSPersonChange} disabled={readOnly}>
          <Radio value={true}>Yes</Radio>
          <Radio value={false}>No</Radio>
        </Radio.Group>
      </Form.Item>

      {usPerson === true && (
        <Form.Item
          label="Select one"
          name={["employment", "prType"]}
          rules={[{ required: !readOnly, message: "Please select one" }]}
        >
          <Radio.Group onChange={(e) => onPRTypeChange(e.target.value)} disabled={readOnly}>
            <Radio value="citizen">Citizen</Radio>
            <Radio value="green-card">Green Card</Radio>
          </Radio.Group>
        </Form.Item>
      )}

      {usPerson === false && (
        <Space size="large" wrap>
          <Form.Item
            label="Work Authorization (Visa Title)"
            name={["employment", "visaTitle"]}
            rules={[{ required: !readOnly, message: "Please select visa title" }]}
          >
            <Select
              style={{ width: 300 }}
              placeholder="Select"
              onChange={onVisaChange}
              disabled={readOnly}
            >
              <Option value="F1">F1(CPT/OPT)</Option>
              <Option value="H1-B">H1-B</Option>
              <Option value="L2">L2</Option>
              <Option value="H4">H4</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          {visaTitle === "other" && (
            <Form.Item
              label="Custom Visa Title"
              name={["employment", "visaTitleCustom"]}
              rules={[{ required: !readOnly, message: "Please enter visa title" }]}
            >
              <Input style={{ width: 300 }} readOnly={readOnly} />
            </Form.Item>
          )}
        </Space>
      )}
    </>
  );
}
