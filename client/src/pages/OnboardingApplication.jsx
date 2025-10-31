// client/src/pages/OnboardingApplication.jsx
import React, { useEffect } from 'react';
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Button,
  Upload,
  Space,
  Divider,
  Typography,
  message,
  Row,
  Col,
} from 'antd';
import dayjs from 'dayjs';
import {
  uploadAvatar,
  uploadDocument,
  getOnboardingMe,
  saveOnboardingMe,
  buildOnboardingPayload,
} from "../api/onboardingApi"; //;
import MainLayout from '../components/mainLayout/mainLayout';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

// Upload 自定义请求（头像）
const AvatarUpload = () => {
  const customAvatarUpload = async ({ file, onSuccess, onError }) => {
    try {
      await uploadAvatar(file);
      message.success('Avatar uploaded');
      onSuccess?.({}, file);
    } catch (e) {
      console.error(e);
      message.error('Avatar upload failed');
      onError?.(e);
    }
  };

  return (
    <Upload
      accept="image/*"
      showUploadList={false}
      customRequest={customAvatarUpload}
    >
      <Button>Upload Avatar</Button>
    </Upload>
  );
};

// 通用文档上传按钮
const DocUploadButton = ({ label, children }) => {
  const customDocUpload = async ({ file, onSuccess, onError }) => {
    try {
      await uploadDocument(file, label);
      message.success(`Uploaded: ${label}`);
      onSuccess?.({}, file);
    } catch (e) {
      console.error(e);
      message.error(`Upload failed: ${label}`);
      onError?.(e);
    }
  };

  return (
    <Upload
      accept=".pdf,.png,.jpg,.jpeg"
      showUploadList={false}
      customRequest={customDocUpload}
    >
      <Button>{children}</Button>
    </Upload>
  );
};

const OnboardingApplication = () => {
  const [form] = Form.useForm();
  const auth = useSelector(state => state.auth);
  const employee = useSelector(state => state.employee);
  
  // 回显（若后端已有数据）
  useEffect(() => {
        const data = employee.employee;
        if (!data) return;
        console.log(data);
        // 将后端数据解构回 Form
        const v = {};
        const p = data.personalInfo || {};
        const a = data.address || {};
        const c = data.contactInfo || {};
        const e = data.employment || {};
        const r = data.reference || {};
        const ecs = data.emergencyContact || [];

        v.email = data.email || '';
        v.firstName = p.firstName || '';
        v.lastName = p.lastName || '';
        v.middleName = p.middleName || '';
        v.preferredName = p.preferredName || '';
        v.ssn = p.ssn || '';
        v.gender = p.gender || '';
        v.dateOfBirth = p.dateOfBirth ? dayjs(p.dateOfBirth) : null;

        v.address1 = a.address1 || '';
        v.address2 = a.address2 || '';
        v.city = a.city || '';
        v.state = a.state || '';
        v.zip = a.zip || '';

        v.cellPhone = c.cellPhoneNumber || '';
        v.workPhone = c.workPhoneNumber || '';

        v.isCitizenOrPR = e.isCitizenOrPR ?? null;
        v.visaType = e.visaType || '';
        v.workAuthStartDate = e.startDate ? dayjs(e.startDate) : null;
        v.workAuthEndDate = e.endDate ? dayjs(e.endDate) : null;
        v.otherVisaTitle = e.otherTitle || '';

        v.refFirstName = r.firstName || '';
        v.refLastName = r.lastName || '';
        v.refPhone = r.phone || '';
        v.refEmail = r.email || '';
        v.refRelationship = r.relationship || '';

        v.emergencyContacts = ecs.length ? ecs : [
          { firstName: '', lastName: '', middleName: '', phone: '', email: '', relationship: '' }
        ];

        form.setFieldsValue(v);  
  }, [employee]);

  // 提交表单
  const onFinish = async (values) => {
    // 日期格式化为 YYYY-MM-DD（你的后端若能收 ISO 字符串也行）
    if (values.dateOfBirth && dayjs.isDayjs(values.dateOfBirth)) {
      values.dateOfBirth = values.dateOfBirth.format('YYYY-MM-DD');
    }
    if (values.workAuthStartDate && dayjs.isDayjs(values.workAuthStartDate)) {
      values.workAuthStartDate = values.workAuthStartDate.format('YYYY-MM-DD');
    }
    if (values.workAuthEndDate && dayjs.isDayjs(values.workAuthEndDate)) {
      values.workAuthEndDate = values.workAuthEndDate.format('YYYY-MM-DD');
    }

    const payload = buildOnboardingPayload(values);

    try {
      await saveOnboardingMe(payload);
      message.success('Application submitted');
    } catch (e) {
      console.error(e);
      message.error('Submit failed');
    }
  };

  return (
    <MainLayout>
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <Title level={3}>Onboarding Application</Title>
      <Text type="secondary">
        Fill the form, upload <b>avatar</b> and <b>documents</b>, then <b>Submit</b>.
      </Text>

      <Divider />

      {/* 文档上传区：OPT 流程 & 驾照示例 */}
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space wrap>
          <AvatarUpload />
          <DocUploadButton label="driver-license">Upload Driver License</DocUploadButton>
          <DocUploadButton label="opt-receipt">Upload OPT Receipt</DocUploadButton>
          <DocUploadButton label="ead">Upload OPT EAD</DocUploadButton>
          <DocUploadButton label="i-983">Upload I-983</DocUploadButton>
          <DocUploadButton label="i-20">Upload I-20</DocUploadButton>
        </Space>
      </Space>

      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          emergencyContacts: [
            { firstName: '', lastName: '', middleName: '', phone: '', email: '', relationship: '' }
          ],
        }}
      >
        <Title level={4}>Basic Info</Title>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="email" label="Email (readonly)">
              <Input readOnly />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="middleName" label="Middle Name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="preferredName" label="Preferred Name">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="ssn" label="SSN" rules={[{ required: true }]}>
              <Input placeholder="123-45-6789" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="gender" label="Gender">
              <Radio.Group>
                <Radio value="male">Male</Radio>
                <Radio value="female">Female</Radio>
                <Radio value="na">I do not wish to answer</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Title level={4}>Address</Title>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="address1" label="Address 1" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="address2" label="Address 2">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="state" label="State" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="zip" label="Zip" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Title level={4}>Contact</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="cellPhone" label="Cell Phone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="workPhone" label="Work Phone">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Title level={4}>Employment / Work Authorization</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="isCitizenOrPR" label="U.S. permanent resident or citizen?">
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="visaType" label="Work Authorization">
              <Radio.Group>
                <Radio value="green-card">Green Card</Radio>
                <Radio value="citizen">Citizen</Radio>
                <Radio value="h1b">H1-B</Radio>
                <Radio value="f1-opt">F1 (CPT/OPT)</Radio>
                <Radio value="h4">H4</Radio>
                <Radio value="other">Other</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="workAuthStartDate" label="Start Date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="workAuthEndDate" label="End Date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) =>
                getFieldValue('visaType') === 'other' ? (
                  <Form.Item name="otherVisaTitle" label="Other Visa Title" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                ) : null
              }
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Title level={4}>Reference (Referral)</Title>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="refFirstName" label="First Name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="refLastName" label="Last Name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="refPhone" label="Phone">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="refEmail" label="Email">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="refRelationship" label="Relationship">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Title level={4}>Emergency Contact (1+)</Title>
        {/* 你也可以换成 Form.List 做可增删的联系人；为简单起见先给一个 */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name={['emergencyContacts', 0, 'firstName']} label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['emergencyContacts', 0, 'lastName']} label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['emergencyContacts', 0, 'middleName']} label="Middle">
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name={['emergencyContacts', 0, 'phone']} label="Phone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['emergencyContacts', 0, 'email']} label="Email" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['emergencyContacts', 0, 'relationship']} label="Relationship" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Application
          </Button>
        </Form.Item>
      </Form>
    </div>
    </MainLayout>
  );
};

export default OnboardingApplication;
