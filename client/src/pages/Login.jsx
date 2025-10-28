import { useState } from 'react';
import { useNavigate } from 'react-router-dom';   
import { message } from 'antd';  
import api from '../api/axiosConfig';
import MainLayout from '../components/mainLayout/mainLayout';
import { AuthForm } from '../components/AuthForm/authForm';

const LoginPage = () => {
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate(); 
  
    const handleSubmit = async (values) => { 
        setLoading(true);

        try {
           const res = await api.post(
                "user/login",
                values,
                { withCredentials: true, credentials: "include" }
            );     

            if (res.data.status === "success") {
                const user = res.data.data.user;
                console.log(user.role);

                //user role can be 'hr' or 'empolyee'
                // dispatch(storeUser(userInfo));
                
                message.success('Welcome back!');
                // navigate('/home', { replace: true }); ==> 根据user role和状态判断
            }  
        } catch (err) {
            if (err.response && err.response.data.message) message.error(err.response.data.message);
            else message.error(err.message); 
        } finally {
            setLoading(false);
        }
  };
  
    return (
        <MainLayout>
            <AuthForm 
                title='Sign in to your account.' 
                fields={[
                {
                    name: 'username',
                    label: 'usernmae',
                    placeholder: 'Enter your username',
                    rules: [
                    { required: true, message: 'Please enter your username!' },
                    { type: 'text', message: 'Invalid username!' },
                    ],
                },
                {
                    name: 'password',
                    label: 'Password',
                    type: 'password',
                    placeholder: 'Enter your password',
                    rules: [{ required: true, message: 'Please enter your password!' }],
                },
                ]}
                buttonText='Log In'
                loading={loading} 
                onSubmit={handleSubmit} 
            > 
            </AuthForm>
        </MainLayout>
        
  );
};

export default LoginPage;
