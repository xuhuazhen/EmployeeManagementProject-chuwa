import React, { useState, useEffect } from "react";
import { Form, Button, Card, message, Modal, Space  } from "antd";
import dayjs from 'dayjs';
import { useParams } from "react-router-dom";
import { AddressCard } from "../components/Profiles/AddressCard"; 
import { BasicInfoCard } from "../components/Profiles/BasicInfoCard";
import { ContactInfoCard } from "../components/Profiles/ContactInfoCard";
import { EmploymentCard } from "../components/Profiles/EmploymentCard"; 
import ReferenceCard from "../components/Profiles/ReferenceCard";
import DocumentsCard from "../components/Profiles/DocumentsCard"; 

import api from "../api/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import EmergencyContactList from "../components/Profiles/EmergencyContactList";
import LoadingSpin from "../components/LoadingSpin/loadingSpin";
import MainLayout from "../components/mainLayout/mainLayout";
import { mapProfileToFormData } from "../utils/mapProfileToFormData";
import { storeInfo } from "../slices/employeeSlice";
import { uploadAvatar } from "../api/onboardingApi";
export default function ProfileDetailPage({ mode }) {
  // mode: "hr" | "employee"
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false); // employee 默认可编辑
  const [loading, setLoading] = useState(mode === "hr"); // hr 初始需要 fetch
  const [userData, setUserData] = useState(null);
  const [file, setFile] = useState(null);
  const user =  useSelector(state => state.auth);
  const e =  useSelector(state => state.employee);
  const dispatch = useDispatch();

    // mode: "hr"获取数据
    const { id } = useParams();
    useEffect (() => {
        console.log('CURRENT MODE:', mode)
        if (mode === "hr" && id) {
        setLoading(true);
        api.get(`/user/profile/${id}`)
            .then((res) => {
            dispatch(storeInfo(res.data.data)); //store current picked userinfo
            const formData = mapProfileToFormData(res.data.data);
            setUserData(formData);
            form.setFieldsValue(formData);
            })
            .finally(() => setLoading(false));
        }  
    }, [id]);

  // mode: "employee"获取数据
  useEffect(() => {
    if (mode === "employee") {
      // employee 使用 store 的数据  
      const formData = mapProfileToFormData(e.employee);
    
      setUserData(formData);
      form.setFieldsValue(formData);
    }
    }, [e]);

  const handleSave  = async () => {
    try {
        const values = await form.validateFields(); 

        // 提取头像文件
        const avatarPromise = file
          ? uploadAvatar(file).then(res => {
              file.url = res.data.url; // 更新 URL
            })
          : Promise.resolve(); 

        //update form
        const patchPromise = await api.patch(`/user/profile/${user.userID}`, values);
            
        
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

  if (loading || !userData) return <LoadingSpin />

  return (
    <MainLayout>
        <h2 style={{marginBottom: '30px', marginLeft: '30px'}}> {mode !== "hr" ? "My Profile" : "Employee Profile Detail"} </h2>
        <Card style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
        <Form form={form} layout="vertical">
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
        </Form>
        </Card>
    </MainLayout>
  );
}
