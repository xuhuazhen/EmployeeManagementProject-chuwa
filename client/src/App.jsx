// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OnboardingApplication from './pages/OnboardingApplication';

// 一个非常简单的 404
function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Oops… Page not found</h2>
      <a href="/onboarding">Go to Onboarding</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 主页重定向到 onboarding，先保证能看到页面 */}
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<OnboardingApplication />} />
        {/* 其他路径 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
