import React from "react";
import { Form, Radio } from "antd";

export default function ReferralToggle({ readOnly = false }) {
  const form = Form.useFormInstance();

  const handleChange = (e) => {
    const has = e.target.value === true;
    if (!has) {
      // 选 No 时，清空 referral 其它字段
      form.setFieldsValue({
        referral: {
          hasReferral: false,
          firstName: undefined,
          lastName: undefined,
          email: undefined,
          phone: undefined,
          relationship: undefined,
        },
      });
    } else {
      // 选 Yes 时，至少把 hasReferral 设成 true，保持其它值不动
      const cur = form.getFieldValue("referral") || {};
      form.setFieldsValue({ referral: { ...cur, hasReferral: true } });
    }
  };

  return (
    <Form.Item
      label="Do you have a referral?"
      name={["referral", "hasReferral"]}
      rules={[{ required: true, message: "Please select Yes or No" }]}
    >
      <Radio.Group onChange={handleChange} disabled={readOnly}>
        <Radio value={true}>Yes</Radio>
        <Radio value={false}>No</Radio>
      </Radio.Group>
    </Form.Item>
  );
}