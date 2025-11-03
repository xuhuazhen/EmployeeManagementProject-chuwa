// client/src/pages/OnboardingApplication.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Form, Button, Card, Alert, Space, Divider, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
 
import MainLayout from "../components/mainLayout/mainLayout";
import LoadingSpin from "../components/LoadingSpin/loadingSpin";
 
 
import { BasicInfoCard } from "../components/Onboarding/BasicInfoCard";
import { AddressCard } from "../components/Onboarding/AddressCard";
import { ContactInfoCard } from "../components/Onboarding/ContactInfoCard";
import { EmploymentCard } from "../components/Onboarding/EmploymentCard";
import ReferenceCard from "../components/Onboarding/ReferenceCard";
import EmergencyContactList from "../components/Onboarding/EmergencyContactList";
import DocumentsCard from "../components/Onboarding/DocumentsCard";
 
import api from "../api/axiosConfig";
import { buildOnboardingPayload } from "../api/onboardingApi"; // 这个只用到 build 方法
import { mapProfileToFormData } from "../utils/mapProfileToFormData";
import { login } from "../slices/authSlice";
import { storeInfo } from "../slices/employeeSlice";
 
const parseNextStep = (ns) => {
  const raw = typeof ns === "string" ? ns : "";
  const [step = "", status = ""] = raw.split("-");
  return { step, status };
};
 
export default function OnboardingApplication() {
  // ⚠️ 所有 hooks 顶层调用
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const auth = useSelector((s) => s.auth);
  const employee = useSelector((s) => s.employee.employee);
  const empLoading = useSelector((s) => s.employee.loading);
 
  const [uiLoading, setUiLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [serverData, setServerData] = useState(null);
  const [titleMsg, setTitleMsg] = useState("Onboarding Application");
  const [avatar, setAvatar] = useState(null);
 
  const { step, status } = useMemo(
    () => parseNextStep(auth?.nextStep),
    [auth?.nextStep]
  );
 
  // 根据 nextStep + employee 决定当前模式
  const applyModeFromNextStep = (userLike) => {
    const { status } = parseNextStep(auth?.nextStep);
    const data = userLike || {};
 
    if (status === "approved") {
      navigate("/home", { replace: true });
      return;
    }
 
    setFeedback(data?.feedback || "");
 
    if (status === "waiting" || !status) {
      setTitleMsg("Onboarding Application (First Submission)");
      form.setFieldsValue({email: employee.email});           // 首次提交：空表单
      setEditing(true);
      return;
    }
 
    if (status === "pending") {
      setTitleMsg("Onboarding Application (Submitted, Pending Review)");
      form.setFieldsValue(mapProfileToFormData(data));
      setEditing(false);            // 只读
      return;
    }
 
    if (status === "rejected") {
      setTitleMsg("Onboarding Application (Rejected – Please Fix and Resubmit)");
      form.setFieldsValue(mapProfileToFormData(data));
      setEditing(true);             // 可编辑并显示反馈
      return;
    }
 
    // 兜底：当作首次提交
    setTitleMsg("Onboarding Application");
    form.resetFields();
    setEditing(true);
  };
 
  // 用 store 里的 employee 初始化（不再请求 /onboarding/me）
  useEffect(() => {
    if (empLoading) return;
    setServerData(employee || null);
    applyModeFromNextStep(employee);
    setUiLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empLoading, employee]);
 
  // 提交（waiting / rejected）
  const handleSubmit = async () => {
    try {
      const v = await form.validateFields();
      const payload = buildOnboardingPayload(v); // 结构对齐后端 User 模型
 
      // 保存到 /user/profile/:id（后端已有）
      const patchRes = await api.patch(`/user/profile/${auth.userID}`, {
        data: payload,
      });
 
      // 同步到本地 store
      dispatch(storeInfo(patchRes.data.data));
      dispatch(
        login({
          userID: auth.userID,
          username: auth.username,
          role: auth.role,
          nextStep: "application-pending",
        })
      );
 
      setEditing(false);
      setTitleMsg("Onboarding Application (Submitted, Pending Review)");
      message.success("Submitted successfully! Please wait for HR to review.");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Please fix the errors before submitting.";
      message.error(msg);
    }
  };
 
  const handleCancel = () => {
    if (serverData) {
      form.setFieldsValue(mapProfileToFormData(serverData));
    } else {
      form.resetFields();
    }
    message.info("Changes discarded");
  };
 
  // 员工端：仅 waiting / rejected 可编辑
  const allowEdit = useMemo(() => {
    if (step !== "application") return false;
    return status === "waiting" || status === "rejected";
  }, [step, status]);
  const readOnly = !editing || !allowEdit;
 
  // 顶部提示条
  const TopBanner = () => {
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
    if (status === "rejected" && feedback) {
      return (
        <Alert
          type="error"
          showIcon
          message="Your application has been rejected."
          description={
            <>
              <div>HR Feedback:</div>
              <div style={{ whiteSpace: "pre-wrap" }}>{feedback}</div>
            </>
          }
          style={{ marginBottom: 16 }}
        />
      );
    }
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
    return null;
  };
 
  return (
    <MainLayout>
      <h2 style={{ margin: "0 0 20px 16px" }}>{titleMsg}</h2>
 
      {/* 让表单保持挂载，避免 useForm 未挂载警告 */}
      {uiLoading && (
        <div style={{ maxWidth: 980, margin: "0 auto 16px" }}>
          <LoadingSpin />
        </div>
      )}
 
      <Card style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
        <TopBanner />
 
        <Form
          form={form}
          layout="vertical"
          preserve={false}
          disabled={uiLoading} // 加载时禁用交互
        >
          <BasicInfoCard mainForm={form} setFile={setAvatar} readOnly={readOnly} />
          <AddressCard form={form} readOnly={readOnly} />
          <ContactInfoCard form={form} readOnly={readOnly} />
          <EmploymentCard form={form} readOnly={readOnly} />
          <EmergencyContactList form={form} readOnly={readOnly} />
          <ReferenceCard form={form} readOnly={readOnly} />
 
          <Divider />
          {/* pending 时作为“已提交文档清单”，只读可预览/下载 */}
          <DocumentsCard form={form} readOnly={status === "pending"} />
 
          {(status === "waiting" || status === "rejected" || !status) && (
            <Space style={{ marginTop: 16 }}>
              {!editing && (
                <Button type="primary" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              )}
              {editing && (
                <>
                  <Button type="primary" onClick={handleSubmit}>
                    Submit
                  </Button>
                  <Button onClick={handleCancel}>Cancel</Button>
                </>
              )}
            </Space>
          )}
        </Form>
      </Card>
    </MainLayout>
  );
}



// // client/src/pages/OnboardingApplication.jsx
// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   Form,
//   Input,
//   DatePicker,
//   Radio,
//   Button,
//   Upload,
//   Space,
//   Divider,
//   Typography,
//   Row,
//   Col,
//   Image,
//   Switch,
//   message,
// } from 'antd';
// import dayjs from 'dayjs';
// import { useSelector } from 'react-redux';

// import {
//   uploadAvatar,
//   uploadDocument,
//   getOnboardingMe,
//   saveOnboardingMe,
//   buildOnboardingPayload,
// } from "../api/onboardingApi";

// import MainLayout from '../components/mainLayout/mainLayout';

// const { Title, Text } = Typography;

// // ---- Absolute URL helper so images served by the server port render correctly
// const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:3000';
// const absolutize = (url) =>
//   typeof url === 'string' && url.startsWith('/api/')
//     ? `${API_ORIGIN}${url}`
//     : url || '';

// /** Avatar uploader (replaces previous image, refreshes preview immediately) */
// const AvatarUpload = ({ disabled, currentUrl, onUpdated }) => {
//   const [preview, setPreview] = useState(absolutize(currentUrl));

//   useEffect(() => {
//     setPreview(absolutize(currentUrl));
//   }, [currentUrl]);

//   const customAvatarUpload = async ({ file, onSuccess, onError }) => {
//     try {
//       const res = await uploadAvatar(file);
//       const newUrl = absolutize(res.data?.url);
//       setPreview(newUrl);
//       onUpdated?.(newUrl);
//       message.success('Avatar uploaded');
//       onSuccess?.({}, file);
//     } catch (e) {
//       console.error(e);
//       message.error('Avatar upload failed');
//       onError?.(e);
//     }
//   };

//   return (
//     <Space align="start" size="large">
//       <Image
//         width={48}
//         height={48}
//         preview={false}
//         src={preview}
//         fallback=""
//         style={{ borderRadius: 8, border: '1px solid #eee', objectFit: 'cover' }}
//       />
//       <Upload
//         accept="image/*"
//         showUploadList={false}
//         customRequest={customAvatarUpload}
//         disabled={disabled}
//       >
//         <Button disabled={disabled}>Upload Avatar</Button>
//       </Upload>
//     </Space>
//   );
// };

// /** Single document upload button hooked to /api/file/upload?label=... */
// const DocUploadButton = ({ label, children, disabled }) => {
//   const customDocUpload = async ({ file, onSuccess, onError }) => {
//     try {
//       await uploadDocument(file, label);
//       message.success(`Uploaded: ${label}`);
//       onSuccess?.({}, file);
//     } catch (e) {
//       console.error(e);
//       message.error(`Upload failed: ${label}`);
//       onError?.(e);
//     }
//   };

//   return (
//     <Upload
//       accept=".pdf,.png,.jpg,.jpeg"
//       showUploadList={false}
//       customRequest={customDocUpload}
//       disabled={disabled}
//     >
//       <Button disabled={disabled}>{children}</Button>
//     </Upload>
//   );
// };

// const OnboardingApplication = () => {
//   const [form] = Form.useForm();
//   const auth = useSelector((state) => state.auth);

//   const [justLocked, setJustLocked] = useState(false);
//   const [avatarUrl, setAvatarUrl] = useState('');

//   // live watchers for conditional UI
//   const isCitizenOrPR = Form.useWatch('isCitizenOrPR', form); // boolean
//   const visaType = Form.useWatch('visaType', form);           // 'citizen' | 'green-card' | 'f1-opt' | 'h1b' | 'h4' | 'other'
//   const hasReferral = Form.useWatch('hasReferral', form);     // boolean

//   // derive current application stage/lock from auth.nextStep
//   const [appStage, appStatus] = useMemo(() => {
//     const ns = auth?.nextStep || '';
//     const i = ns.indexOf('-');
//     return i > -1 ? [ns.slice(0, i), ns.slice(i + 1)] : [null, null];
//   }, [auth?.nextStep]);

//   // locked when application is pending or rejected (your rule)
//   const appDisabled = useMemo(
//     () => appStage === 'application' && ['pending', 'reject'].includes(appStatus),
//     [appStage, appStatus]
//   );
//   const disabledAll = appDisabled || justLocked;

//   /** ---- CONDITIONAL DOCUMENT MATRIX (front-end only) ----
//    * citizen / green-card : NO uploads
//    * f1-opt               : driver-license + opt-receipt
//    * h1b / h4 / other     : driver-license only
//    */
//   const docLabels = useMemo(() => {
//     // if user explicitly indicates PR/citizen OR picked visaType accordingly -> no docs
//     if (isCitizenOrPR === true || visaType === 'citizen' || visaType === 'green-card') {
//       return [];
//     }
//     if (visaType === 'f1-opt') {
//       return ['driver-license', 'opt-receipt'];
//     }
//     // default set
//     return ['driver-license'];
//   }, [isCitizenOrPR, visaType]);

//   // fetch initial data for echoing values
//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await getOnboardingMe();
//         if (!data) return;

//         // avatar from documents
//         const pic = (data.documents || []).find((d) => d.tag === 'profile-picture');
//         setAvatarUrl(absolutize(pic?.url));

//         // flatten server payload to form fields
//         const p = data.personalInfo || {};
//         const a = data.address || {};
//         const c = data.contactInfo || {};
//         const e = data.employment || {};
//         const r = data.reference || {};
//         const ecs = data.emergencyContact || [];

//         const v = {
//           email: data.email || '',
//           firstName: p.firstName || '',
//           lastName: p.lastName || '',
//           middleName: p.middleName || '',
//           preferredName: p.preferredName || '',
//           ssn: p.ssn || '',
//           gender: p.gender || '',
//           dateOfBirth: p.dateOfBirth ? dayjs(p.dateOfBirth) : null,

//           address1: a.address1 || '',
//           address2: a.address2 || '',
//           city: a.city || '',
//           state: a.state || '',
//           zip: a.zip || '',

//           cellPhone: c.cellPhoneNumber || '',
//           workPhone: c.workPhoneNumber || '',

//           // citizen/PR flag (best effort mapping)
//           isCitizenOrPR: e.isF1 === false ? true : (e.isF1 === true ? false : null),

//           visaType: (() => {
//             const t = (e.visaTitle || '').toLowerCase();
//             if (t.includes('citizen')) return 'citizen';
//             if (t.includes('green')) return 'green-card';
//             if (t.includes('h1')) return 'h1b';
//             if (t.includes('h4')) return 'h4';
//             if (t.includes('f1')) return 'f1-opt';
//             return (e.visaTitle ? 'other' : undefined);
//           })(),

//           workAuthStartDate: e.startDate ? dayjs(e.startDate) : null,
//           workAuthEndDate: e.endDate ? dayjs(e.endDate) : null,

//           // Referral toggle auto-on if any field exists
//           hasReferral: Boolean(r.firstName || r.lastName || r.email || r.phone || r.relationship),

//           refFirstName: r.firstName || '',
//           refLastName: r.lastName || '',
//           refPhone: r.phone || '',
//           refEmail: r.email || '',
//           refRelationship: r.relationship || '',

//           emergencyContacts: ecs.length
//             ? ecs
//             : [{ firstName: '', lastName: '', middleName: '', phone: '', email: '', relationship: '' }],
//         };

//         form.setFieldsValue(v);
//       } catch (e) {
//         // no existing data is fine for a new user
//         console.debug('getOnboardingMe empty or failed', e?.message);
//         form.setFieldsValue({
//           emergencyContacts: [{ firstName: '', lastName: '', middleName: '', phone: '', email: '', relationship: '' }],
//           hasReferral: false,
//         });
//       }
//     })();
//   }, [form]);

//   const onFinish = async (values) => {
//     // format dates
//     if (values.dateOfBirth && dayjs.isDayjs(values.dateOfBirth)) {
//       values.dateOfBirth = values.dateOfBirth.format('YYYY-MM-DD');
//     }
//     if (values.workAuthStartDate && dayjs.isDayjs(values.workAuthStartDate)) {
//       values.workAuthStartDate = values.workAuthStartDate.format('YYYY-MM-DD');
//     }
//     if (values.workAuthEndDate && dayjs.isDayjs(values.workAuthEndDate)) {
//       values.workAuthEndDate = values.workAuthEndDate.format('YYYY-MM-DD');
//     }

//     // if referral toggle is off, clear referral fields so they won’t be saved
//     if (!values.hasReferral) {
//       values.refFirstName = '';
//       values.refLastName = '';
//       values.refPhone = '';
//       values.refEmail = '';
//       values.refRelationship = '';
//     }

//     const payload = buildOnboardingPayload(values);

//     try {
//       await saveOnboardingMe(payload);
//       message.success('Application submitted');
//       setJustLocked(true);
//     } catch (e) {
//       console.error(e);
//       message.error('Submit failed');
//     }
//   };

//   return (
//     <MainLayout>
//       <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
//         <Title level={3}>Onboarding Application</Title>
//         <Text type="secondary">
//           Fill the form, upload <b>avatar</b> and required documents (based on your work authorization), then <b>Submit</b>.
//         </Text>

//         <Divider />

//         {/* Avatar */}
//         <AvatarUpload
//           disabled={disabledAll}
//           currentUrl={avatarUrl}
//           onUpdated={(u) => setAvatarUrl(u)}
//         />

//         <Divider />

//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={onFinish}
//           disabled={disabledAll}
//           initialValues={{
//             hasReferral: false,
//             emergencyContacts: [
//               { firstName: '', lastName: '', middleName: '', phone: '', email: '', relationship: '' }
//             ],
//           }}
//         >
//           {/* Basic Info */}
//           <Title level={4}>Basic Info</Title>
//           <Row gutter={16}>
//             <Col span={24}>
//               <Form.Item name="email" label="Email (readonly)">
//                 <Input readOnly />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
//                 <Input />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item name="middleName" label="Middle Name">
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item name="preferredName" label="Preferred Name">
//                 <Input />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item name="ssn" label="SSN" rules={[{ required: true }]}>
//                 <Input placeholder="123-45-6789" />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
//                 <DatePicker style={{ width: '100%' }} />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item name="gender" label="Gender">
//                 <Radio.Group>
//                   <Radio value="male">Male</Radio>
//                   <Radio value="female">Female</Radio>
//                   <Radio value="na">I do not wish to answer</Radio>
//                 </Radio.Group>
//               </Form.Item>
//             </Col>
//           </Row>

//           <Divider />

//           {/* Address */}
//           <Title level={4}>Address</Title>
//           <Row gutter={16}>
//             <Col span={24}>
//               <Form.Item name="address1" label="Address 1" rules={[{ required: true }]}>
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={24}>
//               <Form.Item name="address2" label="Address 2">
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item name="city" label="City" rules={[{ required: true }]}>
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item name="state" label="State" rules={[{ required: true }]}>
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item name="zip" label="Zip" rules={[{ required: true }]}>
//                 <Input />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Divider />

//           {/* Contact */}
//           <Title level={4}>Contact</Title>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item name="cellPhone" label="Cell Phone" rules={[{ required: true }]}>
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item name="workPhone" label="Work Phone">
//                 <Input />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Divider />

//           {/* Employment / Work Authorization */}
//           <Title level={4}>Employment / Work Authorization</Title>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item name="isCitizenOrPR" label="U.S. permanent resident or citizen?">
//                 <Radio.Group>
//                   <Radio value={true}>Yes</Radio>
//                   <Radio value={false}>No</Radio>
//                 </Radio.Group>
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item name="visaType" label="Work Authorization">
//                 <Radio.Group>
//                   <Radio value="green-card">Green Card</Radio>
//                   <Radio value="citizen">Citizen</Radio>
//                   <Radio value="h1b">H1-B</Radio>
//                   <Radio value="f1-opt">F1 (CPT/OPT)</Radio>
//                   <Radio value="h4">H4</Radio>
//                   <Radio value="other">Other</Radio>
//                 </Radio.Group>
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item name="workAuthStartDate" label="Start Date">
//                 <DatePicker style={{ width: '100%' }} />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item name="workAuthEndDate" label="End Date">
//                 <DatePicker style={{ width: '100%' }} />
//               </Form.Item>
//             </Col>

//             <Col span={24}>
//               <Form.Item noStyle shouldUpdate>
//                 {({ getFieldValue }) =>
//                   getFieldValue('visaType') === 'other' ? (
//                     <Form.Item name="otherVisaTitle" label="Other Visa Title" rules={[{ required: true }]}>
//                       <Input />
//                     </Form.Item>
//                   ) : null
//                 }
//               </Form.Item>
//             </Col>
//           </Row>

//           {/* CONDITIONAL DOCUMENTS */}
//           <Divider />
//           <Title level={4}>Documents</Title>
//           {docLabels.length === 0 ? (
//             <Text type="secondary">No documents are required for Citizen / Green Card.</Text>
//           ) : (
//             <Space wrap>
//               {docLabels.includes('driver-license') && (
//                 <DocUploadButton label="driver-license" disabled={disabledAll}>
//                   Upload Driver License
//                 </DocUploadButton>
//               )}
//               {docLabels.includes('opt-receipt') && (
//                 <DocUploadButton label="opt-receipt" disabled={disabledAll}>
//                   Upload OPT Receipt
//                 </DocUploadButton>
//               )}
//             </Space>
//           )}

//           {/* Referral toggle + conditional fields */}
//           <Divider />
//           <Title level={4}>Referral</Title>
//           <Form.Item name="hasReferral" label="Do you have a referral?" valuePropName="checked">
//             <Switch disabled={disabledAll} />
//           </Form.Item>

//           {hasReferral && (
//             <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item name="refFirstName" label="First Name" rules={[{ required: true }]}>
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item name="refLastName" label="Last Name" rules={[{ required: true }]}>
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item name="refPhone" label="Phone" rules={[{ required: true }]}>
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item name="refEmail" label="Email" rules={[{ required: true, type: 'email' }]}>
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item name="refRelationship" label="Relationship" rules={[{ required: true }]}>
//                   <Input />
//                 </Form.Item>
//               </Col>
//             </Row>
//           )}

//           {/* Emergency Contact */}
//           <Divider />
//           <Title level={4}>Emergency Contact (at least 1)</Title>
//           <Row gutter={16}>
//             <Col span={8}>
//               <Form.Item name={['emergencyContacts', 0, 'firstName']} label="First Name" rules={[{ required: true }]}>
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item name={['emergencyContacts', 0, 'lastName']} label="Last Name" rules={[{ required: true }]}>
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item name={['emergencyContacts', 0, 'middleName']} label="Middle">
//                 <Input />
//               </Form.Item>
//             </Col>

//             <Col span={8}>
//               <Form.Item name={['emergencyContacts', 0, 'phone']} label="Phone" rules={[{ required: true }]}>
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item name={['emergencyContacts', 0, 'email']} label="Email" rules={[{ required: true, type: 'email' }]}>
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item name={['emergencyContacts', 0, 'relationship']} label="Relationship" rules={[{ required: true }]}>
//                 <Input />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Divider />

//           <Form.Item>
//             <Button type="primary" htmlType="submit" disabled={disabledAll}>
//               Submit Application
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>
//     </MainLayout>
//   );
// };

// export default OnboardingApplication;