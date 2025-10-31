import { useNavigate } from "react-router-dom"; 
import React from 'react';
import { Button, Result } from 'antd'; 
import MainLayout from "../components/mainLayout/mainLayout";

const ErrorPage = () => {
    const navigate = useNavigate();

    return <>
        <MainLayout>
            <Result
                style={{ 
                    backgroundColor: 'white',
                    minHeight: '300px',
                    height: 'calc(100vh - 200px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                title="Oops, something went wrong!"
                extra={
                    <Button 
                        type="primary" 
                        key="console"
                        onClick={() => navigate('/')}
                    >
                        Go Home
                    </Button>
                 }
            />
        </MainLayout>
    </>
};

export default ErrorPage;