import React, { useState, useEffect } from "react";
import { Form, Button, Card, message, Modal, Space, Divider, Input } from "antd";
import { useLocation, useParams } from "react-router-dom";
import { AddressCard } from "../../components/Profiles/AddressCard"; 
import { BasicInfoCard } from "../../components/Profiles/BasicInfoCard";
import { ContactInfoCard } from "../../components/Profiles/ContactInfoCard";
import { EmploymentCard } from "../../components/Profiles/EmploymentCard"; 
import ReferenceCard from "../../components/Profiles/ReferenceCard";
import DocumentsCard from "../../components/Profiles/DocumentsCard"; 

import api from "../../api/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import EmergencyContactList from "../../components/Profiles/EmergencyContactList";
import LoadingSpin from "../../components/LoadingSpin/loadingSpin";
import MainLayout from "../../components/mainLayout/mainLayout";
import { mapProfileToFormData } from "../../utils/mapProfileToFormData";
import { storeInfo, updateInfo } from "../../slices/employeeSlice";
import { uploadAvatar } from "../../api/onboardingApi"; 

import styles from './profileDetail.module.css';
import AppButton from "../../components/Button/AppButton";

export default function ProfileDetailPage({ mode }) {
  // mode: "hr" | "employee"
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false); // employee 默认可编辑. hr根据当前申请人状态判断是否可以approve/reject
  const [loading, setLoading] = useState(mode === "hr"); // hr 初始需要 fetch
  const [userData, setUserData] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState(''); 
  const [feedbackVisible, setFeedbackVisible] = useState(false);  // 控制反馈弹窗
  const [feedback, setFeedback] = useState("");          

  const user =  useSelector(state => state.auth);
  const e =  useSelector(state => state.employee);
  const dispatch = useDispatch();
  const location = useLocation();

  // mode: "hr"获取数据
  const { id } = useParams();

  useEffect (() => {
    if (mode === "hr" && id) {
      setLoading(true); 

      setTitle(location.pathname.includes("/application") 
        ? 
        'Application Review'
        : 
        'Employee Profile'
      );

      
      api.get(`/user/profile/${id}`)
        .then((res) => {
          dispatch(storeInfo(res.data.data)); //store current picked userinfo 
          
          if (res.data.data.application?.status === location.state?.status) {
              setTitle(`Application Review (${location.state?.status})`)
            //  from hiring management page
            if (location.state?.status === "pending") {
              setEditing(true);
            }
          }

          const formData = mapProfileToFormData(res.data.data);
          setUserData(formData);

          form.setFieldsValue(formData);
        })
        .finally(() => setLoading(false));
    }  
  }, [id, location]);

  // mode: "employee"获取数据
  useEffect(() => {
    if (mode === "employee") {
      // employee 使用 store 的数据  
      setTitle('My Profile');
      const formData = mapProfileToFormData(e.employee);
    
      setUserData(formData);
      form.setFieldsValue(formData);
    }
  }, [e]);

  const handleSave  = async () => {
    try {
        const values = await form.validateFields(); 

        // // 提取头像文件
        const avatarPromise = file
          ? uploadAvatar(file).then(res => {
            console.log(res)
              file.url = res.data.url; // 更新URL
            })
          : Promise.resolve(); 

        //update form
        delete values.documents;
        const patchPromise = api.patch(`/user/profile/${user.userID}`, { data : values });
      
        const [patchRes] = await Promise.all([patchPromise, avatarPromise]);
        
        dispatch(storeInfo(patchRes.data.data)); //store current picked userinfo 

        message.success("Profile saved successfully!");
        setEditing(false);
    } catch (err) {
      if (err.patchRes && err.patchRes.data.message)
        message.error(err.patchRes.data.message);
      else message.error("Please fix the errors before saving");
    }
  };

  const handleCancelEdit = () => {
    Modal.confirm({
        title: "Discard Changes?",
        content: "Are you sure you want to discard all changes?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
        // 回滚表单到初始数据
        form.setFieldsValue(userData);
        setEditing(false);
        message.info("Changes discarded");
        },
    });
    };

  const handleApprove = () => {
    Modal.confirm({
      title: "Approve this application?",
      content: "Once approved, the applicant will be notified and changes can no longer be made.",
      okText: "Approve",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const res = await api.put(`/hr/application/${id}`, { action: "approved" });
          dispatch(updateInfo(res.data.data));

          setEditing(false); 
          message.success("Application approved!"); 
        } catch {
          message.error("Failed to approve application");
        }
      },
    });
  }

  const handleReject = () => {
    console.log('reject 打开feedback');
    setFeedback("");
    setFeedbackVisible(true);
  }

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      message.warning("Please provide feedback before submitting.");
      return;
    }

    try {
      const res = await api.put(`/hr/application/${id}`, {
        action: "rejected",
        feedback,
      });
      
      dispatch(updateInfo(res.data.data));

      message.success("Application rejected!");
      setFeedbackVisible(false); 
      setEditing(false); 
    } catch(err) {
      console.log(err);
      message.error("Failed to reject application");
    }
  };

  if (loading || !userData) return <LoadingSpin />

  return (
    <MainLayout>
        <h2 style={{marginBottom: '30px', marginLeft: '30px'}}> {title} </h2>
        <Card style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
        <Form form={form} layout="vertical" 
            className={mode === "hr" || !editing ? styles.readonlyInput : ""}
        >
            <BasicInfoCard mainForm={form} setFile={setFile} readOnly={mode === "hr" || !editing} />
            <AddressCard form={form} readOnly={mode === "hr" || !editing} />
            <ContactInfoCard form={form} readOnly={mode === "hr" || !editing} />
            <EmploymentCard form={form} readOnly={mode === "hr" || !editing} />
            <EmergencyContactList form={form} readOnly={mode === "hr" || !editing} />
            <ReferenceCard form={form} readOnly={mode === "hr" || !editing} />
            <DocumentsCard form={form} readOnly={mode === "hr"} />

            {mode === "employee" && (
            <Space style={{ marginTop: 16 }}>
                {!editing && (
                <Button type="primary" onClick={() => setEditing(true)}>
                    Edit
                </Button>
                )}
                {editing && (
                <>
                    <Button type="primary" onClick={handleSave}>
                    Save
                    </Button>
                    <Button onClick={handleCancelEdit}>
                    Cancel
                    </Button>
                </>
                )}
            </Space>
            )}
            
            {mode === "hr" && location.pathname.includes("/application") && editing && (
              <>
                <Divider orientation="left"> </Divider>
                <Space style={{ marginTop: 16 }}> 
                  <AppButton onClick={handleApprove}>Approve</AppButton> 
                  <AppButton onClick={handleReject}>Reject</AppButton>  
                </Space>
              </>
            )}

            <Modal
              title="Reject Application"
              open={feedbackVisible}
              onOk={handleSubmitFeedback}
              onCancel={() => setFeedbackVisible(false)}
              okText="Submit"
            >
              <p>Please provide feedback for this rejection:</p>
              <Input.TextArea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter feedback for the applicant..."
              />
            </Modal>

        </Form>
        </Card>
    </MainLayout>
  );
}
