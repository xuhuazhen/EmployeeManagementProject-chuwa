import { useState } from 'react';
import { useNavigate } from 'react-router-dom';   
import { message } from 'antd';  
import api from '../api/axiosConfig';
import { useDispatch } from 'react-redux';
import { AuthForm } from '../components/AuthForm/authForm';
import MainLayout from '../components/mainLayout/mainLayout';
import { storeInfo } from '../slices/employeeSlice';
import { login } from '../slices/authSlice';

const LoginPage = () => {
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate(); 
    const dispatch = useDispatch();

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

                dispatch(login({ userID: user._id, username: user.username, role: user.role, nextStep: user.nextStep }));
                if (user.role === 'employee')  dispatch(storeInfo(user));

                message.success('Welcome back!'); 

                const url = user.role === 'hr' ? '/hr/home' : '/home';
                navigate(`${url}`, { replace: true }); //==> 根据user role和状态判断
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
