import React, {useState} from "react";
import {
  Form,
  Input,
  Select,
  DatePicker, 
  Space,
  Divider, 
} from "antd"; 
import { useEffect } from "react";
import UploadButton from "../Button/UploadButton"; 
import { useSelector } from "react-redux";

export const BasicInfoCard = ({ mainForm, setFile, readOnly = false }) => {
  const [preview, setPreview] = useState(null);   

  const employee =  useSelector(state => state.employee)
  const GENDER_OPTIONS = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "I do not wish to answer", value: "na" },
  ];

  // 正则 SSN
  const SSN_RE = /^\d{3}-?\d{2}-?\d{4}$/;
  
    useEffect(() => {
        const docs = mainForm.getFieldValue(["documents"]);
        //console.log(docs)
        if (Array.isArray(docs) && docs.length > 0) {
            const profileDoc = docs.find((doc) => doc.tag === "profile-picture");
            if (profileDoc?.url) {
                setPreview(profileDoc.url);
        }
        }
    }, [employee]);
  
    const handleFileSelect = (file) => {
        console.log("Uploaded file:", file);

        // 可选：更新 form 的 documents 字段
        const currentDocs = mainForm.getFieldValue(["documents"]) || [];
        const updatedDocs = [
            ...currentDocs.filter((d) => d.tag !== "profile-picture"),
            { tag: "profile-picture", url: URL.createObjectURL(file), file },
        ];
        mainForm.setFieldsValue({ documents: updatedDocs });
        setFile(file);
        setPreview(URL.createObjectURL(file));
    };
  
  return (
    <>
      <Divider orientation="left">Basic Info</Divider>

        <Form.Item label="Email" name={["email"]}>
          <Input readOnly />
        </Form.Item>

        <Form.Item
          label="Profile Picture"
          name={["documents"]} 
          extra="Upload a square image for best result."
        > 
        {preview && (
            <img
                src={preview}
                alt="avatar preview"
                style={{ width: 100, height: 100, objectFit: "cover", marginBottom: 8 }}
            />
            )}
            {!readOnly && <UploadButton onFileSelect={handleFileSelect} isShow={false} type={'img'}/>}
      </Form.Item>

        <Space size="large" wrap>
          <Form.Item
            label="First Name"
            name={["personalInfo", "firstName"]}
            rules={[{ required: !readOnly, message: "First name is required" }]}
            >
              <Input style={{ width: 300 }} readOnly={readOnly} />
          </Form.Item>

          <Form.Item
          label="Last Name"
          name={["personalInfo", "lastName"]}
          rules={[{ required: !readOnly, message: "Last name is required" }]}
          >
            <Input style={{ width: 300 }} readOnly={readOnly} />
        </Form.Item>
        </Space>

        <Space size="large" wrap>
            <Form.Item label="Middle Name" name={["personalInfo", "middleName"]}>
                <Input style={{ width: 300 }} readOnly={readOnly} />
            </Form.Item>
            <Form.Item label="Preferred Name" name={["personalInfo", "preferredName"]}>
                <Input style={{ width: 300 }} readOnly={readOnly} />
            </Form.Item>
        </Space>

        <Space size="large" wrap>
        <Form.Item
          label="SSN"
          name={["personalInfo", "ssn"]}
          rules={[
            { required: !readOnly, message: "SSN is required" },
            { pattern: SSN_RE, message: "Invalid SSN format" },
          ]}
        >
          <Input style={{ width: 300 }} placeholder="123-45-6789" readOnly={readOnly} />
        </Form.Item>

          <Form.Item
          label="Date of Birth"
          name={["personalInfo", "dateOfBirth"]}
          rules={[{ required: !readOnly, message: "Please pick date of birth" }]}
        >
            <DatePicker style={{ width: 300 }} disabled={readOnly} />
          </Form.Item>
        </Space>

        <Form.Item
            label="Gender"
            name={["personalInfo", "gender"]}
            rules={[{ required: !readOnly, message: "Please select gender" }]}
        >
            <Select
            style={{ width: 300 }}
            options={GENDER_OPTIONS}
            placeholder="Select"
            disabled={readOnly}
            />
        </Form.Item>

       
    </>
  );
}
