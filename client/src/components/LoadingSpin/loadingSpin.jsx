import React from 'react';
import { Spin } from 'antd';

const LoadingSpin = () => {
  return (
    <div style={{
        position: 'fixed', 
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)', 
        zIndex: 99999,  
      }}>
      <Spin size="large" tip="Loading..." />
    </div>
  );
};

export default LoadingSpin;
