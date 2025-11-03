import React, { useState, useEffect } from "react";
import { Form, Radio, Select, Divider, Space, Input } from "antd";
import EmploymentCard from "./EmploymentCard";

const { Option } = Select;

export default function StatusSelector({ form, readOnly = false }) {
  // 监听整个 employment 对象
  const employment = Form.useWatch("employment", form) || {};
  const { visaTitle } = employment;

  const [usPerson, setUsPerson] = useState(true);

  // 判断是否 US Person
  useEffect(() => {
    if (visaTitle === "citizen" || visaTitle === "green-card") {
      setUsPerson(true);
    } else {
      setUsPerson(false);
    }
  }, [form.visaTitle]);

  const onUSPersonChange = (e) => {
    setUsPerson(e.target.value);
    form.setFieldsValue({
      employment: {
        startDate: undefined,
        endDate: undefined,
        isF1: false,
        visaTitle: undefined,
        visaTitleCustom: undefined,
      },
    });
  };

  const onPRTypeChange = (val) => {
    form.setFieldsValue({
      employment: {
        ...employment,
        visaTitle: val,
        isF1: false,
      },
    });
  };

  const onVisaChange = (val) => {
    console.log(val)
    form.setFieldsValue({
      employment: {
        ...employment,
        visaTitle: val,
        isF1: val === "F1" ? true : false,
        ...(val !== "other" ? { visaTitleCustom: undefined } : {}),
      },
    });
  };

//   // Select value 映射
//   let selectValue;
//   if (["f1", "F1", "f1-opt"].includes(visaTitle)) selectValue = "F1";
//   else if (visaTitle === "h1b") selectValue = "H1-B";
//   else if (visaTitle === "l2") selectValue = "L2";
//   else if (visaTitle === "h4") selectValue = "H4";
//   else if (visaTitle === "other") selectValue = "other";
//   else selectValue = undefined;

  return (
    <>
      <Divider orientation="left">Status</Divider>

      <Form.Item
        label="Are you a U.S. person (Citizen/Green Card)?"
        name="usPersonTemp"
        rules={[{ required: !readOnly, message: "Please select one" }]}
        value={usPerson}
      >
        <Radio.Group onChange={onUSPersonChange} disabled={readOnly}>
          <Radio value={true}>Yes</Radio>
          <Radio value={false}>No</Radio>
        </Radio.Group>
      </Form.Item>

      {usPerson ? (
        <Form.Item
          label="Select one"
          name={["employment", "visaTitle"]}
          rules={[{ required: !readOnly, message: "Please select one" }]}
        >
          <Radio.Group onChange={(e) => onPRTypeChange(e.target.value)} disabled={readOnly}>
            <Radio value="citizen">Citizen</Radio>
            <Radio value="green-card">Green Card</Radio>
          </Radio.Group>
        </Form.Item>
      ) : (
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
              <Option value="H1-B">H1-B</Option>
              <Option value="F1">F1 (CPT/OPT)</Option>
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
              <Input
                style={{ width: 300 }}
                readOnly={readOnly}
                onChange={(e) =>
                  form.setFieldsValue({
                    employment: {
                      ...employment,
                      visaCustomTitle: e.target.value.trim(),
                      isF1: false,
                    },
                  })
                }
              />
            </Form.Item>
          )}
          
          {/* 雇佣信息 */}
          <EmploymentCard form={form} readOnly={readOnly} />
        </Space>
      )}
    </>
  );
}
