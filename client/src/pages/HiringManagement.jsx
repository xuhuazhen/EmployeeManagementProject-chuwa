import { useState } from 'react'; 
import api from '../api/axiosConfig';
import MainLayout from '../components/mainLayout/mainLayout';
import { Form, Typography, Input, Button, Table, Select, Space, message } from 'antd';
import { SendEmailForm } from '../components/SendEmailForm/sendEmailForm';

const { Title } = Typography;
const { Option } = Select;

const HiringManagementPage = () => {
    const [statusFilter, setStatusFilter] = useState('pending');

    const handleSend = async (values) => {
        console.log(values)
        try {
            const res  = await api.post('hr/signup',
                values,
                { withCredentials: true }
            );
            
            if (res.data.status === "success") {
                message.success('Email send succed!');
            }  
        } catch (err) {
            if (err.response && err.response.data.message) {
                message.error(err.response.data.message);
            } else {
                message.error("Unable to send reset link. Please try again later.");
            }
        } 
    }

    return (
        <MainLayout>
            <Title level={2} style={{ textAlign: 'center', marginTop:"20px" }}>
                Hiring Management
            </Title>
            {/* Send Register Link Section */}
            <SendEmailForm handleSend={handleSend}/>
           
            {/* Onboarding Application Review Section */}
            <div style={{margin: "0 10vw"}}>
                <Title level={4}
                    style={{ textAlign: 'center', marginTop:"20px" }}
                >
                    Onboarding Application Review
                </Title>
                <Space style={{ marginBottom: 16 }}>
                <span>Filter by Status:</span>
                <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }}>
                    <Option value="pending">Pending</Option>
                    <Option value="approved">Approved</Option>
                    <Option value="rejected">Rejected</Option>
                </Select>
                </Space>
                {/* <Table columns={columns} dataSource={filteredData} /> */}
            </div>
        </MainLayout>

    );
}

export default HiringManagementPage;