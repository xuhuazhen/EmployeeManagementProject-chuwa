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
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

/** 工具：Upload 的受控 value 适配器 */
const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

/** 选项 */
const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "I do not wish to answer", value: "na" },
];

const VISA_PR_OPTIONS = [
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
const PHONE_RE = /^\+?1?[-. (]*\d{3}[-. )]*\d{3}[-. ]*\d{4}$/; // 宽松的北美电话
const ZIP_RE = /^\d{5}(-\d{4})?$/;
const SSN_RE = /^\d{3}-?\d{2}-?\d{4}$/;

/** 主组件 */
export default function OnboardingApplication() {
  const [form] = Form.useForm();
  const isUSPR = Form.useWatch(["employment", "isUSPR"], form);
  const workAuth = Form.useWatch(["employment", "workAuth"], form);
  const hasReferral = Form.useWatch(["referral", "hasReferral"], form);

  // 即时交叉校验：Employment Start/End
  const handleValuesChange = () => {
    const startPath = ["employment", "startDate"];
    const endPath = ["employment", "endDate"];
    const start = form.getFieldValue(startPath);
    const end = form.getFieldValue(endPath);
    if (start || end) {
      form.validateFields([startPath, endPath]).catch(() => {});
    }
  };

  // 清理互斥字段
  React.useEffect(() => {
    if (isUSPR === true) {
      form.setFieldsValue({
        employment: {
          workAuth: undefined,
          startDate: undefined,
          endDate: undefined,
          otherTitle: undefined,
          optReceipt: undefined,
        },
      });
    } else if (isUSPR === false) {
      form.setFieldsValue({
        employment: { prStatus: undefined },
      });
    }
  }, [isUSPR]); // eslint-disable-line

  React.useEffect(() => {
    if (workAuth !== "f1-opt") {
      form.setFieldsValue({ employment: { optReceipt: undefined } });
    }
    if (workAuth !== "other") {
      form.setFieldsValue({ employment: { otherTitle: undefined } });
    }
  }, [workAuth]); // eslint-disable-line

  const onFinish = (values) => {
    // 这里对 Upload 值做一个轻微规整（实际集成时可以在提交前转存为 File/URL）
    console.log("Submit values:", values);
    message.success("Validated ✔ (values logged in console)");
  };

  return (
    <Card style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
      <Title level={4} style={{ marginBottom: 8 }}>
        Onboarding Application
      </Title>
      <Text type="secondary">
        Fields marked with * are required. Validation runs as you type.
      </Text>

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

        <Form.Item label="Email (readonly)" name={["basic", "email"]} initialValue="user1@gmail.com">
          <Input readOnly />
        </Form.Item>

        <Form.Item
          label="Profile Picture"
          name={["basic", "profilePicture"]}
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Upload a square image for best result."
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
          >
            <button type="button" style={{ border: 0, background: "none" }}>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>

        <Space size="large" wrap>
          <Form.Item
            label="First Name"
            name={["basic", "firstName"]}
            rules={[{ required: true, message: "First name is required" }]}
          >
            <Input style={{ width: 300 }} />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name={["basic", "lastName"]}
            rules={[{ required: true, message: "Last name is required" }]}
          >
            <Input style={{ width: 300 }} />
          </Form.Item>
        </Space>

        <Space size="large" wrap>
          <Form.Item label="Middle Name" name={["basic", "middleName"]}>
            <Input style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="Preferred Name" name={["basic", "preferredName"]}>
            <Input style={{ width: 300 }} />
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
            <Input style={{ width: 300 }} placeholder="123-45-6789" />
          </Form.Item>
          <Form.Item
            label="Date of Birth"
            name={["basic", "dob"]}
            rules={[{ required: true, message: "Please pick date of birth" }]}
          >
            <DatePicker style={{ width: 300 }} />
          </Form.Item>
        </Space>

        <Form.Item
          label="Gender"
          name={["basic", "gender"]}
          rules={[{ required: true, message: "Please select gender" }]}
        >
          <Select style={{ width: 300 }} options={GENDER_OPTIONS} placeholder="Select" />
        </Form.Item>

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
            <Input style={{ width: 300 }} />
          </Form.Item>
          <Form.Item
            label="State"
            name={["address", "state"]}
            rules={[{ required: true, message: "State is required" }]}
          >
            <Input style={{ width: 300 }} />
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
            <Input style={{ width: 300 }} placeholder="+1 617-xxx-xxxx" />
          </Form.Item>
          <Form.Item
            label="Work Phone"
            name={["contact", "workPhone"]}
            rules={[{ pattern: PHONE_RE, message: "Invalid phone number" }]}
          >
            <Input style={{ width: 300 }} placeholder="+1 617-xxx-xxxx" />
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
            <Select options={VISA_PR_OPTIONS} placeholder="Select one" style={{ width: 320 }} />
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

            {workAuth === "f1-opt" && (
              <Form.Item
                label="OPT Receipt (PDF)"
                name={["employment", "optReceipt"]}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: "Please upload your OPT receipt" }]}
                extra={<Text type="secondary">Blank PDF for testing is OK.</Text>}
              >
                <Upload accept=".pdf" beforeUpload={() => false} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            )}
          </>
        )}

        {/* ================= Documents (示例) ================= */}
        <Divider orientation="left">Documents</Divider>
        <Space size="large" direction="vertical" style={{ width: "100%" }}>
          <Form.Item
            label="Upload Driver License"
            name={["documents", "driverLicense"]}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload accept=".pdf,.png,.jpg,.jpeg" beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Upload Work Authorization"
            name={["documents", "workAuthDoc"]}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="For H1B/OPT/H4 etc."
          >
            <Upload accept=".pdf" beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
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
                <Input style={{ width: 300 }} />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name={["referral", "lastName"]}
                rules={[{ required: true, message: "Referral last name is required" }]}
              >
                <Input style={{ width: 300 }} />
              </Form.Item>
              <Form.Item
                label="Email"
                name={["referral", "email"]}
                rules={[
                  { required: true, message: "Referral email is required" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input style={{ width: 320 }} />
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
                <Input style={{ width: 300 }} />
              </Form.Item>
              <Form.Item
                label="Relationship"
                name={["referral", "relationship"]}
                rules={[{ required: true, message: "Relationship is required" }]}
              >
                <Input style={{ width: 300 }} placeholder="ex: Manager / Colleague" />
              </Form.Item>
            </Space>

            <Form.Item
              label="Referral Letter (optional)"
              name={["referral", "letter"]}
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload accept=".pdf" beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
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
                      {...field}
                      label="First Name"
                      name={[field.name, "firstName"]}
                      fieldKey={[field.fieldKey, "firstName"]}
                      rules={[{ required: true, message: "First name is required" }]}
                    >
                      <Input style={{ width: 260 }} />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Last Name"
                      name={[field.name, "lastName"]}
                      fieldKey={[field.fieldKey, "lastName"]}
                      rules={[{ required: true, message: "Last name is required" }]}
                    >
                      <Input style={{ width: 260 }} />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Middle"
                      name={[field.name, "middleName"]}
                      fieldKey={[field.fieldKey, "middleName"]}
                    >
                      <Input style={{ width: 200 }} />
                    </Form.Item>
                  </Space>

                  <Space size="large" wrap>
                    <Form.Item
                      {...field}
                      label="Phone"
                      name={[field.name, "phone"]}
                      fieldKey={[field.fieldKey, "phone"]}
                      rules={[
                        { required: true, message: "Phone is required" },
                        { pattern: PHONE_RE, message: "Invalid phone number" },
                      ]}
                    >
                      <Input style={{ width: 260 }} />
                    </Form.Item>
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
                      <Input style={{ width: 260 }} />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Relationship"
                      name={[field.name, "relationship"]}
                      fieldKey={[field.fieldKey, "relationship"]}
                      rules={[{ required: true, message: "Relationship is required" }]}
                    >
                      <Input style={{ width: 260 }} />
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