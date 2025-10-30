import React, { useMemo } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Upload,
  message,
  Card,
  Space,
  Divider,
  Radio,
  Row,
  Col,
} from "antd";
import { InboxOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Dragger } = Upload;
const { Option } = Select;

// 简单工具：只保留数字
const digitsOnly = (v = "") => (v || "").replace(/\D+/g, "");

// SSN 掩码/校验
const formatSSN = (raw) => {
  const d = digitsOnly(raw).slice(0, 9);
  const p1 = d.slice(0, 3);
  const p2 = d.slice(3, 5);
  const p3 = d.slice(5, 9);
  return [p1, p2, p3].filter(Boolean).join("-");
};

const ssnValidator = (_, value) => {
  const d = digitsOnly(value);
  if (!d) return Promise.reject("SSN is required");
  if (d.length !== 9) return Promise.reject("SSN must be 9 digits");
  return Promise.resolve();
};

// 电话校验（北美 10 位为例）
const phoneValidator = (label) => (_, value) => {
  const d = digitsOnly(value);
  if (!d) return Promise.reject(`${label} is required`);
  if (d.length < 10) return Promise.reject(`${label} must be at least 10 digits`);
  return Promise.resolve();
};

// 邮箱基本校验
const emailRules = [
  { required: true, message: "Email is required" },
  { type: "email", message: "Invalid email format" },
];

// 图片上传通用前置校验
const beforeImgUpload = (file) => {
  const okType = ["image/jpeg", "image/png"].includes(file.type);
  if (!okType) {
    message.error("Image must be JPG/PNG");
    return Upload.LIST_IGNORE;
  }
  if (file.size / 1024 / 1024 >= 2) {
    message.error("Image must be smaller than 2MB");
    return Upload.LIST_IGNORE;
  }
  return true;
};

export default function OnboardingApplication() {
  const [form] = Form.useForm();

  // 是否为 F1(OPT) —— 控制 OPT Receipt 上传
  const isF1OPT = Form.useWatch(["employment", "visaTitle"], form) === "F1(OPT)";

  // 是否有内推 —— 控制 Reference 区域
  const hasReferral = Form.useWatch(["reference", "hasReferral"], form);

  // 预设性别
  const genderOptions = useMemo(
    () => [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "I do not wish to answer", value: "na" },
    ],
    []
  );

  // 工作签证选项（示例）
  const visaOptions = [
    "Citizen",
    "Green Card",
    "H1-B",
    "L2",
    "F1(OPT)",
    "H4",
    "Other",
  ];

  const handleSubmit = async (values) => {
    // 整理要提交的 payload（可按你们后端 schema 调整）
    const payload = {
      personalInfo: {
        firstName: values.personalInfo?.firstName?.trim(),
        lastName: values.personalInfo?.lastName?.trim(),
        middleName: values.personalInfo?.middleName?.trim(),
        preferredName: values.personalInfo?.preferredName?.trim(),
        ssn: digitsOnly(values.personalInfo?.ssn),
        dateOfBirth: values.personalInfo?.dateOfBirth
          ? dayjs(values.personalInfo.dateOfBirth).toISOString()
          : undefined,
        gender: values.personalInfo?.gender,
        email: values.personalInfo?.email, // disabled 输入
      },
      address: {
        address1: values.address?.address1?.trim(),
        address2: values.address?.address2?.trim(),
        city: values.address?.city?.trim(),
        state: values.address?.state?.trim(),
        zip: values.address?.zip?.trim(),
      },
      contactInfo: {
        cellPhoneNumber: digitsOnly(values.contactInfo?.cellPhoneNumber),
        workPhoneNumber: digitsOnly(values.contactInfo?.workPhoneNumber),
      },
      employment: {
        visaTitle: values.employment?.visaTitle,
        startDate: values.employment?.startDate
          ? dayjs(values.employment.startDate).toISOString()
          : undefined,
        endDate: values.employment?.endDate
          ? dayjs(values.employment.endDate).toISOString()
          : undefined,
        isF1: values.employment?.visaTitle === "F1(OPT)",
      },
      // profilePicture 单独放在 documents 下，或按你们 schema 放 documents 数组
      documents: {
        profilePicture: values.documents?.profilePicture, // 上传返回的 URL
        optReceipt: values.documents?.optReceipt, // 仅 F1(OPT) 才会写入
        referralLetter: values.reference?.referralLetter, // 选 Yes 才有
      },
      // 内推
      reference:
        values.reference?.hasReferral === "yes"
          ? {
              firstName: values.reference?.firstName?.trim(),
              lastName: values.reference?.lastName?.trim(),
              phone: digitsOnly(values.reference?.phone),
              email: values.reference?.email?.trim(),
              relationship: values.reference?.relationship?.trim(),
            }
          : undefined,
      emergencyContact: values.emergencyContact?.map((c) => ({
        firstName: c.firstName?.trim(),
        lastName: c.lastName?.trim(),
        middleName: c.middleName?.trim(),
        phone: digitsOnly(c.phone),
        email: c.email?.trim(),
        relationship: c.relationship?.trim(),
      })),
    };

    // TODO: 调你们后端 API
    // await axios.post('/api/onboarding/submit', payload)

    console.log("submit payload:", payload);
    message.success("Saved!");
  };

  // 这里给一个默认 email（实际请从登录用户/上游带入）
  const initialValues = {
    personalInfo: { email: "user1@gmail.com" },
    reference: { hasReferral: "no" },
    emergencyContact: [
      {
        firstName: "",
        lastName: "",
        middleName: "",
        phone: "",
        email: "",
        relationship: "",
      },
    ],
  };

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: 16 }}>
      <h2 style={{ marginBottom: 16 }}>Onboarding Application</h2>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
        validateTrigger={["onChange", "onBlur"]} // 即时校验
        scrollToFirstError
      >
        {/* 基本信息 */}
        <Card title="Basic Info" size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Email" name={["personalInfo", "email"]} rules={emailRules}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="First Name"
                name={["personalInfo", "firstName"]}
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input placeholder="First name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Last Name"
                name={["personalInfo", "lastName"]}
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input placeholder="Last name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Middle Name" name={["personalInfo", "middleName"]}>
                <Input placeholder="Middle name (optional)" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Preferred Name" name={["personalInfo", "preferredName"]}>
                <Input placeholder="Preferred name (optional)" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="SSN"
                name={["personalInfo", "ssn"]}
                rules={[{ validator: ssnValidator }]}
                getValueFromEvent={(e) => formatSSN(e?.target?.value)}
              >
                <Input placeholder="123-45-6789" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Date of Birth"
                name={["personalInfo", "dateOfBirth"]}
                rules={[{ required: true, message: "Date of birth is required" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Gender"
                name={["personalInfo", "gender"]}
                rules={[{ required: true, message: "Gender is required" }]}
              >
                <Select placeholder="Select">
                  {genderOptions.map((g) => (
                    <Option key={g.value} value={g.value}>
                      {g.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Profile Picture（必传） */}
            <Col span={24}>
              <Form.Item label="Profile Picture" required tooltip="JPG/PNG ≤ 2MB">
                {/* 隐藏字段做必填锚点 */}
                <Form.Item
                  noStyle
                  name={["documents", "profilePicture"]}
                  rules={[{ required: true, message: "Please upload your profile picture" }]}
                >
                  <Input type="hidden" />
                </Form.Item>

                <Dragger
                  name="file"
                  accept=".jpg,.jpeg,.png"
                  maxCount={1}
                  action="/api/file/upload"
                  beforeUpload={beforeImgUpload}
                  onChange={(info) => {
                    if (info.file.status === "done") {
                      const url =
                        info.file.response?.url || info.file.response?.data?.url;
                      if (url) {
                        form.setFieldValue(["documents", "profilePicture"], url);
                        message.success("Profile picture uploaded");
                      } else {
                        message.warning("Upload succeeded but no URL returned");
                      }
                    } else if (info.file.status === "error") {
                      message.error("Upload failed");
                    }
                  }}
                  onRemove={() =>
                    form.setFieldValue(["documents", "profilePicture"], undefined)
                  }
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag image to upload (JPG/PNG, ≤ 2MB)
                  </p>
                </Dragger>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 地址 */}
        <Card title="Address" size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Address 1"
                name={["address", "address1"]}
                rules={[{ required: true, message: "Address 1 is required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Address 2" name={["address", "address2"]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="City"
                name={["address", "city"]}
                rules={[{ required: true, message: "City is required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="State"
                name={["address", "state"]}
                rules={[{ required: true, message: "State is required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Zip"
                name={["address", "zip"]}
                rules={[{ required: true, message: "Zip is required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 联系方式 */}
        <Card title="Contact Info" size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Cell Phone"
                name={["contactInfo", "cellPhoneNumber"]}
                rules={[{ validator: phoneValidator("Cell phone") }]}
              >
                <Input placeholder="(xxx) xxx-xxxx" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Work Phone"
                name={["contactInfo", "workPhoneNumber"]}
                rules={[{ validator: phoneValidator("Work phone") }]}
              >
                <Input placeholder="(xxx) xxx-xxxx" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 就业/签证 */}
        <Card title="Employment" size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Work Authorization"
                name={["employment", "visaTitle"]}
                rules={[{ required: true, message: "Work authorization is required" }]}
              >
                <Select placeholder="Select">
                  {visaOptions.map((v) => (
                    <Option key={v} value={v}>
                      {v}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Start Date" name={["employment", "startDate"]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="End Date" name={["employment", "endDate"]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            {/* F1/OPT：上传 OPT Receipt（可选改成必传） */}
            {isF1OPT && (
              <Col span={24}>
                <Divider />
                <Form.Item label="OPT Receipt (PDF/JPG/PNG)">
                  <Form.Item
                    noStyle
                    name={["documents", "optReceipt"]}
                    // 若要必传可加 required: true
                    rules={[]}
                  >
                    <Input type="hidden" />
                  </Form.Item>
                  <Dragger
                    name="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxCount={1}
                    action="/api/file/upload-opt"
                    beforeUpload={(file) => {
                      const isPdf = file.type === "application/pdf";
                      const isImg = ["image/jpeg", "image/png"].includes(file.type);
                      if (!isPdf && !isImg) {
                        message.error("Must be PDF/JPG/PNG");
                        return Upload.LIST_IGNORE;
                      }
                      if (file.size / 1024 / 1024 >= 5) {
                        message.error("File must be smaller than 5MB");
                        return Upload.LIST_IGNORE;
                      }
                      return true;
                    }}
                    onChange={(info) => {
                      if (info.file.status === "done") {
                        const url =
                          info.file.response?.url || info.file.response?.data?.url;
                        if (url) {
                          form.setFieldValue(["documents", "optReceipt"], url);
                          message.success("OPT receipt uploaded");
                        }
                      } else if (info.file.status === "error") {
                        message.error("Upload failed");
                      }
                    }}
                    onRemove={() =>
                      form.setFieldValue(["documents", "optReceipt"], undefined)
                    }
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to upload</p>
                    <p className="ant-upload-hint">PDF/JPG/PNG, ≤ 5MB</p>
                  </Dragger>
                </Form.Item>
              </Col>
            )}
          </Row>
        </Card>

        {/* Reference（内推） */}
        <Card title="Reference (Referral)" size="small" style={{ marginBottom: 16 }}>
          <Form.Item
            label="Do you have a referral?"
            name={["reference", "hasReferral"]}
            rules={[{ required: true, message: "Please select" }]}
          >
            <Radio.Group>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Form.Item>

          {hasReferral === "yes" && (
            <>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Referrer First Name"
                    name={["reference", "firstName"]}
                    rules={[{ required: true, message: "First name is required" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Referrer Last Name"
                    name={["reference", "lastName"]}
                    rules={[{ required: true, message: "Last name is required" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Referrer Phone"
                    name={["reference", "phone"]}
                    rules={[{ validator: phoneValidator("Referrer phone") }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Referrer Email"
                    name={["reference", "email"]}
                    rules={[
                      { required: true, message: "Email is required" },
                      { type: "email", message: "Invalid email" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Relationship"
                    name={["reference", "relationship"]}
                    rules={[{ required: true, message: "Relationship is required" }]}
                  >
                    <Input placeholder="e.g., ex-manager, colleague" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Divider>Optional: Referral Letter</Divider>
                  <Form.Item noStyle name={["reference", "referralLetter"]}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Dragger
                    name="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxCount={1}
                    action="/api/file/upload"
                    beforeUpload={(file) => {
                      const isPdf = file.type === "application/pdf";
                      const isImg = ["image/jpeg", "image/png"].includes(file.type);
                      if (!isPdf && !isImg) {
                        message.error("Must be PDF/JPG/PNG");
                        return Upload.LIST_IGNORE;
                      }
                      if (file.size / 1024 / 1024 >= 5) {
                        message.error("File must be smaller than 5MB");
                        return Upload.LIST_IGNORE;
                      }
                      return true;
                    }}
                    onChange={(info) => {
                      if (info.file.status === "done") {
                        const url =
                          info.file.response?.url || info.file.response?.data?.url;
                        form.setFieldValue(["reference", "referralLetter"], url);
                        message.success("Referral letter uploaded");
                      } else if (info.file.status === "error") {
                        message.error("Upload failed");
                      }
                    }}
                    onRemove={() =>
                      form.setFieldValue(["reference", "referralLetter"], undefined)
                    }
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to upload</p>
                    <p className="ant-upload-hint">Optional attachment</p>
                  </Dragger>
                </Col>
              </Row>
            </>
          )}
        </Card>

        {/* Emergency Contacts（可增删，至少 1 条） */}
        <Card title="Emergency Contact(s)" size="small" style={{ marginBottom: 16 }}>
          <Form.List name="emergencyContact" rules={[
            {
              validator: async (_, list) => {
                if (!list || list.length < 1) {
                  return Promise.reject(new Error("At least one emergency contact"));
                }
              },
            },
          ]}>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, idx) => (
                  <Card
                    key={field.key}
                    type="inner"
                    title={`Contact #${idx + 1}`}
                    style={{ marginBottom: 12 }}
                    extra={
                      <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                      >
                        Remove
                      </Button>
                    }
                  >
                    <Row gutter={16}>
                      <Col xs={24} md={8}>
                        <Form.Item
                          {...field}
                          label="First Name"
                          name={[field.name, "firstName"]}
                          fieldKey={[field.fieldKey, "firstName"]}
                          rules={[{ required: true, message: "First name is required" }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item
                          {...field}
                          label="Last Name"
                          name={[field.name, "lastName"]}
                          fieldKey={[field.fieldKey, "lastName"]}
                          rules={[{ required: true, message: "Last name is required" }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item
                          {...field}
                          label="Middle Name"
                          name={[field.name, "middleName"]}
                          fieldKey={[field.fieldKey, "middleName"]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={8}>
                        <Form.Item
                          {...field}
                          label="Phone"
                          name={[field.name, "phone"]}
                          fieldKey={[field.fieldKey, "phone"]}
                          rules={[{ validator: phoneValidator("Phone") }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item
                          {...field}
                          label="Email"
                          name={[field.name, "email"]}
                          fieldKey={[field.fieldKey, "email"]}
                          rules={[
                            { required: true, message: "Email is required" },
                            { type: "email", message: "Invalid email" },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item
                          {...field}
                          label="Relationship"
                          name={[field.name, "relationship"]}
                          fieldKey={[field.fieldKey, "relationship"]}
                          rules={[{ required: true, message: "Relationship is required" }]}
                        >
                          <Input placeholder="e.g., spouse, parent, friend" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}

                <Form.ErrorList errors={errors} />
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    add({
                      firstName: "",
                      lastName: "",
                      middleName: "",
                      phone: "",
                      email: "",
                      relationship: "",
                    })
                  }
                  block
                >
                  Add Emergency Contact
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={() => form.validateFields()}>Validate Now</Button>
          <Button onClick={() => form.resetFields()}>Reset</Button>
        </Space>
      </Form>
    </div>
  );
}
