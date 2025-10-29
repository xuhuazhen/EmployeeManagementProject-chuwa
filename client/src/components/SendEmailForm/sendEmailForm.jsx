
import { Form, Input, Button } from 'antd';
import styles from './sendEmailForm.module.css';

export const SendEmailForm = ({handleSend}) => {
    const [form] = Form.useForm();
    
    const onFinish = (values) => {
        handleSend(values);
        form.resetFields();
    }
    
    return (
        <Form form={form} onFinish={onFinish} className={styles.section}>
            <h2>Send Registration</h2>
            <div className={styles.inputRow}>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input email!' },
                        { type: 'email', message: 'Enter a valid email!' },
                    ]}
                            >
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item
                    label="Full Name"
                    name="fullName"
                        rules={[{ required: true, message: 'Please input full name!' }]}
                >
                    <Input placeholder="Full Name" />
                </Form.Item>
            </div>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Send Email
                </Button>
            </Form.Item>
        </Form>         
                       
    )
}