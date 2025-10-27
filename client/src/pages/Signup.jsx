import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { message } from 'antd';  
import api from '../api/axiosConfig';
import { AuthForm } from '../components/AuthForm/authForm';
import MainLayout from '../components/mainLayout/mainLayout';

const SignupPage =  ({ signupEmail, signupToken }) => {
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate(); 
    const email = signupEmail; 

    const handleSubmit = async (values) => {  
        setLoading(true); 
        
        const resBody = {
            username: values.username,
            email,
            password: values.password,
            signupToken,
        };
        console.log(resBody); 

        try {
            const res = await api.post(
                'user/signup',
                JSON.stringify(resBody),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }    
            )
            if (res.data.status === "success") {
              //const user = res.data.data.user; // ===>  dispatch to store
                message.success('Signup successful!'); 
                // navigate('/application'); //signup succeed==> application page
            }
        } catch(err) {
            if (err.response && err.response.data.message) message.error(err.response.data.message);
            else message.error(err.message);
        } finally {
            setLoading(false);
        }
  };
    
    return (
            <MainLayout>
                <AuthForm 
                    title="Create your account."
                    fields={[
                    {
                        name: 'email',
                        label: 'Email',
                        value: email
                    },
                    {
                        name: 'username',
                        label: 'Username',
                        type: 'text',
                        placeholder: 'Enter your username',
                        rules: [
                            { required: true, message: 'Username is required' },
                            { validator: (_, value) => {
                                if (!value) return Promise.resolve();
                                if (value.length < 5)
                                    return Promise.reject('Password must be at least 5 characters.');
                                return Promise.resolve();
                            }}
                        ]
                    },
                    {
                        name: 'password',
                        label: 'Password',
                        type: 'password',
                        placeholder: 'Enter your password',
                        rules: [
                            {required: true, message: 'Please enter your password!' },
                            { validator: (_, value) => {
                                if (!value) return Promise.resolve();
                                if (value.length < 6)
                                    return Promise.reject('Password must be at least 6 characters.');
                                if (!/[A-Z]/.test(value))
                                    return Promise.reject('Password must include an uppercase letter.');
                                if (!/[a-z]/.test(value))
                                    return Promise.reject('Password must include a lowercase letter.');
                                if (!/[0-9]/.test(value))
                                    return Promise.reject('Password must include a number.');
                                if (!/[\W_]/.test(value))
                                    return Promise.reject('Password must include a special character.');
                                return Promise.resolve();
                            },
                        }],
                    },
                    {
                        name: 'repassword',
                        label: 'Confirm Password',
                        type: 'password',
                        placeholder: 'Enter your password again',
                        rules: [
                            {required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ],
                    }   
                    ]}
                    buttonText="Sign Up"
                    loading={loading}
                    onSubmit={handleSubmit} 
                >
                </AuthForm>
            </MainLayout>
      );
};

export default SignupPage; 