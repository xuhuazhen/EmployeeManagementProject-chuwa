import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Card } from 'antd';
import MainLayout from '../components/mainLayout/mainLayout';

const { Title, Text } = Typography;

const HomePage = () => {
  const user = useSelector((state) => state.auth); 

  return (
    <MainLayout>
        <Card style={{ maxWidth: 600, margin: '50px auto', textAlign: 'center' }}>
        <Title level={2}>
            Welcome, {user.username}!
        </Title>
        <Text>
            You are logged in as <strong>{user.role}</strong>.
        </Text>
        </Card>
    </MainLayout>
  );
};

export default HomePage;