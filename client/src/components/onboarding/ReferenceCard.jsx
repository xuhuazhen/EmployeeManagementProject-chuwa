// src/components/onboarding/OnboardingApplicationUI.jsx
import React, { useMemo, useState } from "react";
import {
  Form,
  Card,
  Space,
  Divider,
  Alert,
  Button,
  message,
  Typography,
  Radio,
  Input,
} from "antd";
import { useSelector } from "react-redux";
import MainLayout from "../mainLayout/mainLayout";

// 身份选择（保留你已写好的）
import StatusSelector from "../onboarding/StatusSelector";

// 可复用卡片
import { BasicInfoCard } from "../Profiles/BasicInfoCard";
import { AddressCard } from "../Profiles/AddressCard";
import { ContactInfoCard } from "../Profiles/ContactInfoCard";
import { EmploymentCard } from "../Profiles/EmploymentCard";
import EmergencyContactList from "../Profiles/EmergencyContactList";
import DocumentsCard from "../Profiles/DocumentsCard";

import UploadButton from "../Button/UploadButton";

const { Text } = Typography;

/** 解析 nextStep：形如 "application-waiting" */
const parseNextStep = (ns) => {
  const raw = typeof ns === "string" ? ns : "";
  const [, status = ""] = raw.split("-");
  return { status };
};

const statusTitle = (status) => {
  switch (status) {
    case "waiting":
      return "Onboarding Application (First Submission)";
    case "pending":
      return "Onboarding Application (Submitted, Pending Review)";
    case "rejected":
      return "Onboarding Application (Rejected – Please Fix and Resubmit)";
    case "approved":
      return "Onboarding Application (Approved)";
    default:
      return "Onboarding Application";
  }
};

/** 身份判断（实时 watch） */
function useIdentity(form) {
  const emp = Form.useWatch("employment", form) || {};

  // PR 分支
  const prType = emp?.prType; // 'citizen' | 'green-card' | undefined
  const isUSPR = prType === "citizen" || prType === "green-card";

  // 签证分支
  const vt = emp?.visaTitle;
  const vtype = emp?.visaType;

  const isF1 =
    (typeof vt === "string" && vt.toUpperCase().startsWith("F1")) ||
    vtype === "f1-opt";

  const isOtherWorkAuth =
    !isUSPR &&
    !isF1 &&
    ((typeof vt === "string" &&
      ["H1-B", "L2", "H4", "OTHER"].includes(vt.toUpperCase())) ||
      (typeof vtype === "string" &&
        ["h1b", "l2", "h4", "other"].includes(vtype)));

  return { isUSPR, prType, isF1, isOtherWorkAuth };
}

const TopBanner = ({ status, feedback }) => {
  if (status === "waiting" || !status) {
    return (
      <Alert
        type="warning"
        showIcon
        message="First submission required."
        description="Please complete the onboarding application and submit."
        style={{ marginBottom: 16 }}
      />
    );
  }
  if (status === "pending") {
    return (
      <Alert
        type="info"
        showIcon
        message="Your application has been submitted."
        description="Please wait for HR to review your application. You can view your submitted information and uploaded documents below."
        style={{ marginBottom: 16 }}
      />
    );
  }
  if (status === "rejected") {
    return (
      <Alert
        type="error"
        showIcon
        message="Your application has been rejected."
        description={
          <div style={{ whiteSpace: "pre-wrap" }}>
            {feedback || "Please review HR feedback and resubmit your application."}
          </div>
        }
        style={{ marginBottom: 16 }}
      />
    );
  }
  if (status === "approved") {
    return (
      <Alert
        type="success"
        showIcon
        message="Your application has been approved."
        description="You can review your information below."
        style={{ marginBottom: 16 }}
      />
    );
  }
  return null;
};

/** 把文件塞进 form.documents（替换同 tag） */
function addOrReplaceDoc(form, { tag, file }) {
  const cur = form.getFieldValue("documents") || [];
  const next = cur.filter((d) => d.tag !== tag);

  const title = file?.name || `${tag}.file`;
  const url = URL.createObjectURL(file);

  next.push({
    tag,
    title,
    url,
    file,
    _local: true,
  });

  form.setFieldsValue({ documents: next });
  message.success(`Added "${title}" (${tag})`);
}

/** 身份驱动的上传区：直接可上传（不等审批） */
function IdentityUploadPanel({
  form,
  isUSPR,
  prType,
  isF1,
  isOtherWorkAuth,
  readOnly,
}) {
  if (readOnly) {
    return (
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 12 }}
        message="Uploaded Documents"
        description="Below is the list of your uploaded documents. You can preview or download them."
      />
    );
  }

  // 共通：驾照
  const renderDriverLicense = (
    <Space size="small" wrap>
      <Text strong>Driver’s License:</Text>
      <UploadButton
        type="doc"
        onFileSelect={(file) =>
          addOrReplaceDoc(form, { tag: "driver-license", file })
        }
      />
    </Space>
  );

  if (isUSPR) {
    return (
      <Card size="small" style={{ marginBottom: 12 }}>
        <Space direction="vertical" size={8}>
          <Text>
            As a U.S. {prType === "citizen" ? "citizen" : "permanent resident"}, please upload the following:
          </Text>
          {renderDriverLicense}
          {prType === "green-card" ? (
            <Space size="small" wrap>
              <Text strong>Green Card (Front/Back):</Text>
              <UploadButton
                type="doc"
                onFileSelect={(file) =>
                  addOrReplaceDoc(form, { tag: "green-card", file })
                }
              />
            </Space>
          ) : (
            <Space size="small" wrap>
              <Text strong>Proof of Citizenship (Passport/Birth Certificate):</Text>
              <UploadButton
                type="doc"
                onFileSelect={(file) =>
                  addOrReplaceDoc(form, { tag: "citizenship-proof", file })
                }
              />
            </Space>
          )}
        </Space>
      </Card>
    );
  }

  if (isF1) {
    return (
      <Card size="small" style={{ marginBottom: 12 }}>
        <Space direction="vertical" size={8}>
          <Text>For F1 (CPT/OPT), please upload:</Text>
          <Space size="small" wrap>
            <Text strong>OPT Receipt:</Text>
            <UploadButton
              type="doc"
              onFileSelect={(file) =>
                addOrReplaceDoc(form, { tag: "opt-receipt", file })
              }
            />
          </Space>
          {renderDriverLicense}
          <Text type="secondary">
            After HR approval, you will upload EAD → I-983 → I-20 in sequence on the Visa Status page.
          </Text>
        </Space>
      </Card>
    );
  }

  if (isOtherWorkAuth) {
    return (
      <Card size="small" style={{ marginBottom: 12 }}>
        <Space direction="vertical" size={8}>
          <Text>Please upload your work authorization document for your visa type, and your driver’s license.</Text>
          <Space size="small" wrap>
            <Text strong>Work Authorization:</Text>
            <UploadButton
              type="doc"
              onFileSelect={(file) =>
                addOrReplaceDoc(form, { tag: "work-auth", file })
              }
            />
          </Space>
          {renderDriverLicense}
        </Space>
      </Card>
    );
  }

  return (
    <Card size="small" style={{ marginBottom: 12 }}>
      <Space direction="vertical" size={8}>
        <Alert
          type="warning"
          showIcon
          message="Select your status"
          description="Choose your status in the Status section to see the exact required uploads."
        />
        {renderDriverLicense}
      </Space>
    </Card>
  );
}

export default function OnboardingApplicationUI() {
  const [form] = Form.useForm();
  const auth = useSelector((s) => s.auth);
  const employee = useSelector((s) => s.employee?.employee);

  const { status } = useMemo(() => {
    const { status } = parseNextStep(auth?.nextStep || "application-waiting");
    return { status };
  }, [auth?.nextStep]);

  // waiting/rejected → editable；pending/approved → readonly
  const [editing, setEditing] = useState(
    status === "waiting" || status === "rejected"
  );
  const readOnly =
    status === "pending" || status === "approved" ? true : !editing;

  const { isUSPR, prType, isF1, isOtherWorkAuth } = useIdentity(form);

  const handleSubmitUIOnly = async () => {
    try {
      await form.validateFields();
      message.success("Validation passed (UI-only). Files are stored in form state.");
      setEditing(false);
    } catch {
      /* antd 自带错误提示 */
    }
  };

  const handleCancelUIOnly = () => {
    form.resetFields();
    setEditing(false);
    message.info("Changes discarded (UI-only).");
  };

  // 关键：给 referral.hasReferral 一个稳定布尔初值
  const initialValues = {
    ...(employee || {}),
    documents: employee?.documents || [],
    referral: {
      hasReferral: employee?.referral?.hasReferral ?? false,
      firstName: employee?.referral?.firstName,
      lastName: employee?.referral?.lastName,
      email: employee?.referral?.email,
      phone: employee?.referral?.phone,
      relationship: employee?.referral?.relationship,
    },
  };

  return (
    <MainLayout>
      <h2 style={{ margin: "0 0 20px 16px" }}>{statusTitle(status)}</h2>

      <Card style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
        <TopBanner status={status} feedback={employee?.feedback} />

        <Form form={form} layout="vertical" initialValues={initialValues}>
          <BasicInfoCard mainForm={form} readOnly={readOnly} />
          <AddressCard form={form} readOnly={readOnly} />
          <ContactInfoCard form={form} readOnly={readOnly} />

          {/* 明确身份选择（US Person / Visa） */}
          <StatusSelector form={form} readOnly={readOnly} />

          {/* 雇佣信息（含起止日期等） */}
          <EmploymentCard form={form} readOnly={readOnly} />

          {/* 身份驱动上传区（立即可上传） */}
          <IdentityUploadPanel
            form={form}
            isUSPR={isUSPR}
            prType={prType}
            isF1={isF1}
            isOtherWorkAuth={isOtherWorkAuth}
            readOnly={readOnly}
          />

          <EmergencyContactList form={form} readOnly={readOnly} />

          {/* ======= Referral（内联实现，无组件） ======= */}
          <Divider orientation="left">Referral</Divider>

          {/* Yes/No 开关：写入 referral.hasReferral，并在切回 No 时清空明细字段 */}
          <Form.Item
            label="Do you have a referral?"
            name={["referral", "hasReferral"]}
            rules={[{ required: true, message: "Please select Yes or No" }]}
          >
            <Radio.Group
              disabled={readOnly}
              onChange={(e) => {
                const yes = e.target.value === true;
                if (!yes) {
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
                }
              }}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>

          {/* 依赖渲染：只有 Yes 才显示并校验这些字段；No 时仅显示 “No referral” */}
          <Form.Item noStyle dependencies={[["referral", "hasReferral"]]}>
            {({ getFieldValue }) => {
              const has = getFieldValue(["referral", "hasReferral"]) === true;
              if (!has) return <div>No referral</div>;

              const PHONE_RE = /^\d{3}-?\d{3}-?\d{4}$/;

              return (
                <>
                  <Space size="large" wrap>
                    <Form.Item
                      label="First Name"
                      name={["referral", "firstName"]}
                      rules={[{ required: true, message: "Referral first name is required" }]}
                    >
                      <Input style={{ width: 300 }} readOnly={readOnly} />
                    </Form.Item>

                    <Form.Item
                      label="Last Name"
                      name={["referral", "lastName"]}
                      rules={[{ required: true, message: "Referral last name is required" }]}
                    >
                      <Input style={{ width: 300 }} readOnly={readOnly} />
                    </Form.Item>

                    <Form.Item
                      label="Email"
                      name={["referral", "email"]}
                      rules={[
                        { required: true, message: "Referral email is required" },
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
                        { required: true, message: "Referral phone is required" },
                        { pattern: PHONE_RE, message: "Invalid phone number" },
                      ]}
                    >
                      <Input style={{ width: 300 }} readOnly={readOnly} />
                    </Form.Item>

                    <Form.Item
                      label="Relationship"
                      name={["referral", "relationship"]}
                      rules={[{ required: true, message: "Relationship is required" }]}
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
            }}
          </Form.Item>
          {/* ======= /Referral ======= */}

          <Divider />

          {/* 文档清单（预览/下载） */}
          <DocumentsCard form={form} />

          {(status === "waiting" || status === "rejected") && (
            <Space style={{ marginTop: 16 }}>
              {!editing && (
                <Button type="primary" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              )}
              {editing && (
                <>
                  <Button type="primary" onClick={handleSubmitUIOnly}>
                    Submit
                  </Button>
                  <Button onClick={handleCancelUIOnly}>Cancel</Button>
                </>
              )}
            </Space>
          )}
        </Form>
      </Card>
    </MainLayout>
  );
}
