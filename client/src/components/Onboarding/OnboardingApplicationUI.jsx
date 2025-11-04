// src/components/onboarding/OnboardingApplicationUI.jsx
import React, { useMemo, useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../mainLayout/mainLayout";

// 身份选择（保留你已写好的）
import StatusSelector from "../Onboarding/StatusSelector";

// 可复用卡片
import { BasicInfoCard } from "./BasicInfoCard";
import { AddressCard } from "./AddressCard";
import { ContactInfoCard } from "./ContactInfoCard";
import { EmploymentCard } from "./EmploymentCard";
import EmergencyContactList from "./EmergencyContactList";
import DocumentsCard from "./DocumentsCard";

import UploadButton from "../Button/UploadButton";
import { mapProfileToFormData } from "../../utils/mapProfileToFormData";
import { uploadAvatar, uploadDocument } from "../../api/onboardingApi";
import api from "../../api/axiosConfig";
import { storeInfo } from "../../slices/employeeSlice";
import { updateStep } from "../../slices/authSlice";

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
    case "reject":
      return "Onboarding Application (Rejected – Please Fix and Resubmit)";
    case "approved":
      return "Onboarding Application (Approved)";
    default:
      return "Onboarding Application";
  }
};

/** 身份判断（实时 watch） */
function useIdentity(form) {
  // 监听整个 employment 对象
  const emp = Form.useWatch("employment", form) || {};

  const isUSPR = emp.visaTitle === "citizen" || emp.visaTitle === "green-card";
  const isF1 = emp.visaTitle === 'F1';
  
  // 其他工作签证类型
  const isOtherWorkAuth =
    !isUSPR &&
    !isF1 &&
    emp.visaTitle &&
    !["f1", "F1", "f1-opt", "citizen", "green-card", "h1b", "l2", "h4"].includes(emp.visaTitle);

  return { isUSPR, isF1, isOtherWorkAuth };
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
  if (status === "reject") {
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
  // console.log(cur, tag)
  const normalizedTag = String(tag).trim();
  const next = cur.filter((d) => String(d.tag).trim() !== normalizedTag);
  // console.log(next)

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
            As a U.S. person, please upload the following:
          </Text>
          {renderDriverLicense}
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

const OnboardingApplicationUI = () => {
  const [form] = Form.useForm();
  const auth = useSelector((s) => s.auth);
  const employee = useSelector((s) => s.employee?.employee);
  const dispatch = useDispatch();

  const { status } = useMemo(() => {
    const { status } = parseNextStep(auth?.nextStep || "application-waiting");
    return { status };
  }, [auth]);
  
  const [hasReference, setHasReference] = useState(false);
  const [avatar, setAvatar] = useState(null);

  // waiting/rejected → editable；pending/approved → readonly
  const [editing, setEditing] = useState(
    status === "waiting" || status === "reject"
  );
  const readOnly =
    status === "pending" || status === "approved" ? true : !editing;

  const { isUSPR, isF1, isOtherWorkAuth } = useIdentity(form);

  const handleSubmitUIOnly = async () => {
    try {
      const formValue = await form.validateFields();

      const documents = form.getFieldValue("documents") || []; 
    
        // 判断 driver-license 是否存在
        const hasDriverLicense = documents.some(doc => String(doc.tag).trim() === "driver-license");
          if (!hasDriverLicense) {
            message.error("Driver’s License is required.");
            return;
        }

        if (form.getFieldValue(['employment', 'visaTitle']) === 'F1') {
            const hasOPTReceipt = documents.some(doc => String(doc.tag).trim() === "opt-receipt");
            if (!hasOPTReceipt) {
                message.error("OPT Receipt is required for F1 employees.");
                return;
            }
        }

        const uploadPromises = [];

        if (avatar) await uploadAvatar(avatar);
   
        for (const doc of documents) {
            if (doc.file && doc.tag) {
                uploadPromises.push(uploadDocument(doc.file, doc.tag));
            }
        }

        await Promise.all(uploadPromises);

        const res = await api.post("/onboarding/me", {userId: employee._id , formValue});
        console.log(res)
        dispatch(storeInfo(res.data));
        dispatch(updateStep(res.nextStep));
        setEditing(false); 
        message.success("Application submitted");
    } catch (err){
      /* antd 自带错误提示 */
      console.log(err)
      message.error("Validation FAILED");
    }
  };

  const handleCancelUIOnly = () => {
    form.resetFields();
    setEditing(false);
    message.info("Changes discarded.");
  }
   

  // 初始化把 employee 的 referral 写进表单
  useEffect(() => {
    const data = mapProfileToFormData(employee);
    form.setFieldsValue(data); 

    const hasReference = data.reference !== null ? true : null;
    setHasReference(hasReference);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee]);
 

  const PHONE_RE = /^\d{3}-?\d{3}-?\d{4}$/;

  return (
    <MainLayout>
      <h2 style={{ margin: "0 0 20px 16px" }}>{statusTitle(status)}</h2>

      <Card style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
        <TopBanner status={status} feedback={employee.application?.feedback} />

        <Form form={form} layout="vertical" >
          <BasicInfoCard setFile={setAvatar} mainForm={form} readOnly={readOnly} />
          <AddressCard form={form} readOnly={readOnly} />
          <ContactInfoCard form={form} readOnly={readOnly} />

          {/* 身份选择 */}
          <StatusSelector form={form} readOnly={readOnly} />


          {/* 身份驱动上传区 */}
          <IdentityUploadPanel
            form={form}
            isUSPR={isUSPR} 
            isF1={isF1}
            isOtherWorkAuth={isOtherWorkAuth}
            readOnly={readOnly}
          />

          <EmergencyContactList form={form} readOnly={readOnly} />

          {/* ====== Referral（最简单实现）====== */}
          <Divider orientation="left">Referral</Divider>

          <Form.Item label="Do you have a referral?">
            <Radio.Group
              value={hasReference}
              disabled={readOnly}
              onChange={(e) => { 
                setHasReference(e.target.value)
                if (e.target.value === false) {
                  // 切回 No：清空表单里的 referral 明细
                  form.setFieldsValue({
                    reference: { 
                      firstName: null,
                      lastName: null,
                      email: null,
                      phone: null,
                      relationship: null,
                    },
                  });
                }  
              }}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>

          {!hasReference ? (
            <div>No referral</div>
          ) : (
            <>
              <Space size="large" wrap>
                <Form.Item
                  label="First Name"
                  name={["reference", "firstName"]}
                  rules={[{ required: true, message: "Referral first name is required" }]}
                >
                  <Input style={{ width: 300 }} readOnly={readOnly} />
                </Form.Item>

                <Form.Item
                  label="Last Name"
                  name={["reference", "lastName"]}
                  rules={[{ required: true, message: "Referral last name is required" }]}
                >
                  <Input style={{ width: 300 }} readOnly={readOnly} />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name={["reference", "email"]}
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
                  name={["reference", "phone"]}
                  rules={[
                    { required: true, message: "Referral phone is required" },
                    { pattern: PHONE_RE, message: "Invalid phone number" },
                  ]}
                >
                  <Input style={{ width: 300 }} readOnly={readOnly} />
                </Form.Item>

                <Form.Item
                  label="Relationship"
                  name={["reference", "relationship"]}
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
          )}
          {/* ====== /Referral ====== */}

          <Divider />

          {/* 文档清单（预览/下载） */}
          <DocumentsCard form={form} />

          {(status === "waiting" || status === "reject") && (
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

export default OnboardingApplicationUI;