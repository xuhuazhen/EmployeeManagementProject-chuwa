// client/src/pages/Onboarding.jsx
import React from "react";
import dayjs from "dayjs";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  Space,
  Divider,
  Typography,
  Radio,
  message,
  Card,
  Tag,
  Alert,
} from "antd";
import { PlusOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";

// === 关键：从 src/pages 到 src/api 的正确相对路径 ===
import {
  getMe,        // GET /api/onboarding/me
  saveMe,       // POST /api/onboarding/me
  uploadAvatar, // POST /api/onboarding/me/avatar (FormData 'file')
  uploadDocument, // POST /api/onboarding/me/upload (FormData 'file' + 'label')
} from "../api/onboardingApi";

const { Title, Text } = Typography;

/** Upload 的受控 value 适配器 */
const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

/** 选项 */
const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "I do not wish to answer", value: "na" },
];

const PR_OPTIONS = [
  { label: "Green Card", value: "green-card" },
  { label: "Citizen", value: "citizen" },
];

const WORK_AUTH_OPTIONS = [
  { label: "H1-B", value: "h1b" },
  { label: "L2", value: "l2" },
  { label: "F1 (CPT/OPT)", value: "f1-opt" },
  { label: "H4", value: "h4" },
  { label: "Other", value: "other" },
];

/** 正则 */
const PHONE_RE = /^\+?1?[-. (]*\d{3}[-. )]*\d{3}[-. ]*\d{4}$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;
const SSN_RE = /^\d{3}-?\d{2}-?\d{4}$/;

export default function Onboarding() {
  const [form] = Form.useForm();
  const isUSPR = Form.useWatch(["employment", "isUSPR"], form);
  const workAuth = Form.useWatch(["employment", "workAuth"], form);
  const hasReferral = Form.useWatch(["referral", "hasReferral"], form);

  const [loading, setLoading] = React.useState(false);
  const [me, setMe] = React.useState(null);

  // ===== 拉取 “/me” 并灌入初始值 =====
  const fetchMe = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getMe();
      setMe(data);

      const iv = {
        basic: {
          email: data?.email || "",
          firstName: data?.personalInfo?.firstName,
          lastName: data?.personalInfo?.lastName,
          middleName: data?.personalInfo?.middleName,
          preferredName: data?.personalInfo?.preferredName,
          ssn: data?.personalInfo?.ssn,
          dob: data?.personalInfo?.dob ? dayjs(data.personalInfo.dob) : undefined,
          gender: data?.personalInfo?.gender,
        },
        address: {
          address1: data?.address?.address1,
          address2: data?.address?.address2,
          city: data?.address?.city,
          state: data?.address?.state,
          zip: data?.address?.zip,
        },
        contact: {
          cellPhone: data?.contactInfo?.cellPhoneNumber,
          workPhone: data?.contactInfo?.workPhoneNumber,
        },
        employment: {
          isUSPR: typeof data?.employment?.isUSPR === "boolean" ? data.employment.isUSPR : false,
          prStatus: data?.employment?.prStatus,
          workAuth: data?.employment?.workAuth,
          otherTitle: data?.employment?.otherTitle,
          startDate: data?.employment?.startDate ? dayjs(data.employment.startDate) : undefined,
          endDate: data?.employment?.endDate ? dayjs(data.employment.endDate) : undefined,
        },
        referral: {
          hasReferral:
            !!data?.reference?.firstName ||
            !!data?.reference?.lastName ||
            !!data?.reference?.email
              ? true
              : false,
          firstName: data?.reference?.firstName,
          lastName: data?.reference?.lastName,
          email: data?.reference?.email,
          phone: data?.reference?.phone,
          relationship: data?.reference?.relationship,
        },
        emergencyContact:
          data?.emergencyContact && Array.isArray(data.emergencyContact) && data.emergencyContact.length > 0
            ? data.emergencyContact.map((c) => ({
                firstName: c.firstName,
                lastName: c.lastName,
                middleName: c.middleName,
                phone: c.phone,
                email: c.email,
                relationship: c.relationship,
              }))
            : [{ firstName: "", lastName: "", email: "", phone: "", relationship: "" }],
      };

      form.setFieldsValue(iv);
    } catch (e) {
      console.error(e);
      message.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, [form]);

  React.useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // ===== 顶部状态条 =====
  const missingOpt = React.useMemo(() => {
    const docs = me?.documents || [];
    const hasReceipt = docs.some((d) => d?.label === "opt-receipt");
    const hasEad = docs.some((d) => d?.label === "opt-ead");
    const hasI983 = docs.some((d) => d?.label === "i-983");
    const hasI20 = docs.some((d) => d?.label === "i-20");
    const miss = [];
    if (!hasReceipt) miss.push("OPT Receipt");
    if (!hasEad) miss.push("EAD");
    if (!hasI983) miss.push("I-983");
    if (!hasI20) miss.push("I-20");
    return miss;
  }, [me]);

  // ===== 头像上传 =====
  const handleAvatarUpload = async ({ file }) => {
    try {
      await uploadAvatar(file);
      message.success("Avatar uploaded");
      fetchMe();
    } catch (e) {
      console.error(e);
      message.error("Avatar upload failed");
    }
  };

  // ===== 文档上传 =====
  const handleDocUpload = (label) => async ({ file }) => {
    try {
      await uploadDocument(file, label);
      message.success(`${label || "Document"} uploaded`);
      fetchMe();
    } catch (e) {
      console.error(e);
      message.error("Upload failed");
    }
  };

  // ===== 提交表单 =====
  const onFinish = async (values) => {
    const payload = {
      personalInfo: {
        firstName: values.basic?.firstName,
        lastName: values.basic?.lastName,
        middleName: values.basic?.middleName,
        preferredName: values.basic?.preferredName,
        ssn: values.basic?.ssn,
        dob: values.basic?.dob ? values.basic.dob.toISOString() : undefined,
        gender: values.basic?.gender,
      },
      address: { ...values.address },
      contactInfo: {
        cellPhoneNumber: values.contact?.cellPhone,
        workPhoneNumber: values.contact?.workPhone,
      },
      employment: {
        isUSPR: values.employment?.isUSPR,
        prStatus: values.employment?.prStatus,
        workAuth: values.employment?.workAuth,
        otherTitle: values.employment?.otherTitle,
        startDate: values.employment?.startDate ? values.employment.startDate.toISOString() : undefined,
        endDate: values.employment?.endDate ? values.employment.endDate.toISOString() : undefined,
      },
      reference: values.referral?.hasReferral
        ? {
            firstName: values.referral?.firstName,
            lastName: values.referral?.lastName,
            email: values.referral?.email,
            phone: values.referral?.phone,
            relationship: values.referral?.relationship,
          }
        : undefined,
      emergencyContact:
        values.emergencyContact?.map((c) => ({
          firstName: c.firstName,
          lastName: c.lastName,
          middleName: c.middleName,
          phone: c.phone,
          email: c.email,
          relationship: c.relationship,
        })) || [],
    };

    try {
      await saveMe(payload);
      message.success("Application saved / submitted");
      fetchMe();
    } catch (e) {
      console.error(e);
      message.error("Save failed");
    }
  };

  const handleValuesChange = () => {
    const startPath = ["employment", "startDate"];
    const endPath = ["employment", "endDate"];
    const start = form.getFieldValue(startPath);
    const end = form.getFieldValue(endPath);
    if (start || end) {
      form.validateFields([startPath, endPath]).catch(() => {});
    }
  };

  React.useEffect(() => {
    if (isUSPR === true) {
      form.setFieldsValue({
        employment: {
          workAuth: undefined,
          otherTitle: undefined,
          startDate: undefined,
          endDate: undefined,
        },
      });
    } else if (isUSPR === false) {
      form.setFieldsValue({ employment: { prStatus: undefined } });
    }
  }, [isUSPR]); // eslint-disable-line

  React.useEffect(() => {
    if (workAuth !== "other") {
      form.setFieldsValue({ employment: { otherTitle: undefined } });
    }
  }, [workAuth]); // eslint-disable-line

  return (
    <Card
      loading={loading}
      style={{ maxWidth: 1100, margin: "0 auto" }}
      bodyStyle={{ padding: 16 }}
      title={<Title level={4} style={{ margin: 0 }}>Onboarding Application</Title>}
      extra={
        <Space wrap>
          <Tag color="blue">backend: application {me?.application?.status || "waiting"}</Tag>
          {missingOpt.length > 0 && (
            <Tag color="orange">work auth package: missing {missingOpt.join(", ")}</Tag>
          )}
        </Space>
      }
    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 12 }}
        message={
          <span>
            Fill the form, upload <b>avatar</b> & documents, then <b>Submit</b>. Required fields marked with *.
          </span>
        }
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        validateTrigger="onChange"
        onValuesChange={handleValuesChange}
        initialValues={{
          referral: { hasReferral: false },
          employment: { isUSPR: false },
          emergencyContact: [{ firstName: "", lastName: "", email: "", phone: "", relationship: "" }],
        }}
      >
        {/* ================= Basic Info ================= */}
        <Divider orientation="left">Basic Info</Divider>

        <Space align="start" size="large" wrap style={{ width: "100%" }}>
          <div>
            <Upload
              listType="picture-card"
              showUploadList={false}
              customRequest={handleAvatarUpload}
              accept="image/*"
            >
              <button type="button" style={{ border: 0, background: "none" }}>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload Avatar</div>
              </button>
            </Upload>
            <Text type="secondary">Square image recommended</Text>
          </div>

          <div style={{ flex: 1, minWidth: 520 }}>
            <Form.Item label="Email (readonly)" name={["basic", "email"]}>
              <Input readOnly />
            </Form.Item>

            <Space size="large" wrap>
              <Form.Item
                label="First Name"
                name={["basic", "firstName"]}
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input style={{ width: 260 }} />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name={["basic", "lastName"]}
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input style={{ width: 260 }} />
              </Form.Item>
              <Form.Item label="Middle Name" name={["basic", "middleName"]}>
                <Input style={{ width: 220 }} />
              </Form.Item>
              <Form.Item label="Preferred Name" name={["basic", "preferredName"]}>
                <Input style={{ width: 220 }} />
              </Form.Item>
            </Space>

            <Space size="large" wrap>
              <Form.Item
                label="SSN"
                name={["basic", "ssn"]}
                rules={[
                  { required: true, message: "SSN is required" },
                  { pattern: SSN_RE, message: "Invalid SSN format" },
                ]}
              >
                <Input style={{ width: 260 }} placeholder="123-45-6789" />
              </Form.Item>
              <Form.Item
                label="Date of Birth"
                name={["basic", "dob"]}
                rules={[{ required: true, message: "Please pick date of birth" }]}
              >
                <DatePicker style={{ width: 220 }} />
              </Form.Item>
              <Form.Item
                label="Gender"
                name={["basic", "gender"]}
                rules={[{ required: true, message: "Please select gender" }]}
              >
                <Select style={{ width: 220 }} options={GENDER_OPTIONS} placeholder="Select" />
              </Form.Item>
            </Space>
          </div>
        </Space>

        {/* ================= Address ================= */}
        <Divider orientation="left">Address</Divider>
        <Form.Item
          label="Address 1"
          name={["address", "address1"]}
          rules={[{ required: true, message: "Address 1 is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Address 2" name={["address", "address2"]}>
          <Input />
        </Form.Item>

        <Space size="large" wrap>
          <Form.Item
            label="City"
            name={["address", "city"]}
            rules={[{ required: true, message: "City is required" }]}
          >
            <Input style={{ width: 260 }} />
          </Form.Item>
          <Form.Item
            label="State"
            name={["address", "state"]}
            rules={[{ required: true, message: "State is required" }]}
          >
            <Input style={{ width: 220 }} />
          </Form.Item>
          <Form.Item
            label="Zip"
            name={["address", "zip"]}
            rules={[
              { required: true, message: "Zip is required" },
              { pattern: ZIP_RE, message: "Invalid ZIP code" },
            ]}
          >
            <Input style={{ width: 220 }} />
          </Form.Item>
        </Space>

        {/* ================= Contact ================= */}
        <Divider orientation="left">Contact</Divider>
        <Space size="large" wrap>
          <Form.Item
            label="Cell Phone"
            name={["contact", "cellPhone"]}
            rules={[
              { required: true, message: "Cell phone is required" },
              { pattern: PHONE_RE, message: "Invalid phone number" },
            ]}
          >
            <Input style={{ width: 260 }} placeholder="+1 617-xxx-xxxx" />
          </Form.Item>
          <Form.Item
            label="Work Phone"
            name={["contact", "workPhone"]}
            rules={[{ pattern: PHONE_RE, message: "Invalid phone number" }]}
          >
            <Input style={{ width: 260 }} placeholder="+1 617-xxx-xxxx" />
          </Form.Item>
        </Space>

        {/* ================= Employment ================= */}
        <Divider orientation="left">Employment</Divider>

        <Form.Item
          label="Are you a U.S. permanent resident or citizen?"
          name={["employment", "isUSPR"]}
          rules={[{ required: true, message: "Please choose Yes or No" }]}
        >
          <Radio.Group>
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </Form.Item>

        {isUSPR === true && (
          <Form.Item
            label="Status"
            name={["employment", "prStatus"]}
            rules={[{ required: true, message: "Please select your status" }]}
          >
            <Select options={PR_OPTIONS} placeholder="Select one" style={{ width: 320 }} />
          </Form.Item>
        )}

        {isUSPR === false && (
          <>
            <Form.Item
              label="Work Authorization"
              name={["employment", "workAuth"]}
              rules={[{ required: true, message: "Please select your work authorization" }]}
            >
              <Select options={WORK_AUTH_OPTIONS} placeholder="Select one" style={{ width: 320 }} />
            </Form.Item>

            {workAuth === "other" && (
              <Form.Item
                label="Visa Title"
                name={["employment", "otherTitle"]}
                rules={[{ required: true, message: "Please enter your visa title" }]}
              >
                <Input style={{ width: 320 }} placeholder="Enter visa title" />
              </Form.Item>
            )}

            <Space size="large" wrap>
              <Form.Item
                label="Start Date"
                name={["employment", "startDate"]}
                rules={[
                  { required: true, message: "Please pick start date" },
                  {
                    validator(_, value) {
                      const end = form.getFieldValue(["employment", "endDate"]);
                      if (!value || !end) return Promise.resolve();
                      if (dayjs(value).isAfter(dayjs(end), "day")) {
                        return Promise.reject(new Error("Start Date cannot be after End Date"));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker style={{ width: 220 }} />
              </Form.Item>

              <Form.Item
                label="End Date"
                name={["employment", "endDate"]}
                dependencies={[["employment", "startDate"]]}
                rules={[
                  { required: true, message: "Please pick end date" },
                  {
                    validator(_, value) {
                      const start = form.getFieldValue(["employment", "startDate"]);
                      if (!value || !start) return Promise.resolve();
                      if (dayjs(value).isBefore(dayjs(start), "day")) {
                        return Promise.reject(new Error("End Date must be on or after Start Date"));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker style={{ width: 220 }} />
              </Form.Item>
            </Space>

            {/* F1(OPT) 追加 OPT Receipt 上传（label=opt-receipt） */}
            {workAuth === "f1-opt" && (
              <Form.Item label="OPT Receipt (PDF)" extra={<Text type="secondary">Blank PDF is OK for testing.</Text>}>
                <Upload accept=".pdf" showUploadList={false} customRequest={handleDocUpload("opt-receipt")}>
                  <Button icon={<UploadOutlined />}>Upload OPT Receipt</Button>
                </Upload>
              </Form.Item>
            )}
          </>
        )}

        {/* ================= Documents (示例) ================= */}
        <Divider orientation="left">Documents</Divider>
        <Space size="large" wrap>
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            customRequest={handleDocUpload("driver-license")}
            accept=".pdf,.png,.jpg,.jpeg"
          >
            <Button icon={<UploadOutlined />}>Upload Driver License</Button>
          </Upload>

          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            customRequest={handleDocUpload("work-auth")}
            accept=".pdf"
          >
            <Button icon={<UploadOutlined />}>Upload Work Authorization</Button>
          </Upload>
        </Space>

        {/* ================= Referral ================= */}
        <Divider orientation="left">Reference (Referral)</Divider>
        <Form.Item
          label="Do you have a referral?"
          name={["referral", "hasReferral"]}
          rules={[{ required: true, message: "Please choose Yes or No" }]}
        >
          <Radio.Group>
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </Form.Item>

        {hasReferral === true && (
          <>
            <Space size="large" wrap>
              <Form.Item
                label="First Name"
                name={["referral", "firstName"]}
                rules={[{ required: true, message: "Referral first name is required" }]}
              >
                <Input style={{ width: 260 }} />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name={["referral", "lastName"]}
                rules={[{ required: true, message: "Referral last name is required" }]}
              >
                <Input style={{ width: 260 }} />
              </Form.Item>
              <Form.Item
                label="Email"
                name={["referral", "email"]}
                rules={[
                  { required: true, message: "Referral email is required" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input style={{ width: 280 }} />
              </Form.Item>
            </Space>

            <Space size="large" wrap>
              <Form.Item
                label="Phone"
                name={["referral", "phone"]}
                rules={[
                  { required: true, message: "Referral phone is required" },
                  { pattern: PHONE_RE, message: "Invalid phone number" },
                ]}
              >
                <Input style={{ width: 260 }} />
              </Form.Item>
              <Form.Item
                label="Relationship"
                name={["referral", "relationship"]}
                rules={[{ required: true, message: "Relationship is required" }]}
              >
                <Input style={{ width: 260 }} placeholder="ex: Manager / Colleague" />
              </Form.Item>
            </Space>
          </>
        )}

        {/* ================= Emergency Contacts ================= */}
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
                  key={field.key}
                  size="small"
                  title={`Contact #${idx + 1}`}
                  style={{ marginBottom: 12 }}
                  extra={
                    fields.length > 1 ? (
                      <Button danger type="text" icon={<DeleteOutlined />} onClick={() => remove(field.name)}>
                        Remove
                      </Button>
                    ) : null
                  }
                >
                  <Space size="large" wrap>
                    <Form.Item
                      name={[field.name, "firstName"]}
                      rules={[{ required: true, message: "First name is required" }]}
                      label="First Name"
                    >
                      <Input style={{ width: 240 }} />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, "lastName"]}
                      rules={[{ required: true, message: "Last name is required" }]}
                      label="Last Name"
                    >
                      <Input style={{ width: 240 }} />
                    </Form.Item>
                    <Form.Item name={[field.name, "middleName"]} label="Middle">
                      <Input style={{ width: 180 }} />
                    </Form.Item>
                  </Space>

                  <Space size="large" wrap>
                    <Form.Item
                      name={[field.name, "phone"]}
                      rules={[
                        { required: true, message: "Phone is required" },
                        { pattern: PHONE_RE, message: "Invalid phone number" },
                      ]}
                      label="Phone"
                    >
                      <Input style={{ width: 240 }} />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, "email"]}
                      rules={[
                        { required: true, message: "Email is required" },
                        { type: "email", message: "Invalid email" },
                      ]}
                      label="Email"
                    >
                      <Input style={{ width: 240 }} />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, "relationship"]}
                      rules={[{ required: true, message: "Relationship is required" }]}
                      label="Relationship"
                    >
                      <Input style={{ width: 240 }} />
                    </Form.Item>
                  </Space>
                </Card>
              ))}

              <Form.ErrorList errors={errors} />
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                Add Emergency Contact
              </Button>
            </>
          )}
        </Form.List>

        {/* ================= Actions ================= */}
        <Divider />
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={() => form.validateFields()}>Validate Now</Button>
          <Button onClick={() => form.resetFields()}>Reset</Button>
        </Space>
      </Form>
    </Card>
  );
}
