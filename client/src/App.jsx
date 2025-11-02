// src/App.jsx
import React from "react";
// 原页面（保留注释，随时可切回真实页面）：
// import OnboardingApplication from "./pages/OnboardingApplication";
import OnboardingApplicationUI from "./components/onboarding/OnboardingApplicationUI";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthGuardForSignup } from "./router/AuthGuard";
import Protected from "./router/Protected";

import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import HiringManagement from "./pages/Hiring/HiringManagement";
import VisaManagement from "./pages/VisaManagement/VisaManagement";
import HomePage from "./pages/Home";
import VisaStatusPage from "./pages/VisaStatus";
import ProfileDetailPage from "./pages/ProfileDetail/ProfileDetail";
import Profiles from "./pages/Profiles/Profiles";
import ErrorPage from "./pages/ErrorPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ---------- Public / Auth ---------- */}
        <Route
          path="/login"
          element={
            <Protected>
              <LoginPage />
            </Protected>
          }
        />
        <Route
          path="/signup/*"
          element={
            <AuthGuardForSignup>
              <SignupPage />
            </AuthGuardForSignup>
          }
        />

        {/* ---------- Employee ---------- */}
        <Route
          path="/home"
          element={
            <Protected route="employee">
              <HomePage />
            </Protected>
          }
        />
        <Route
          path="/visa-status"
          element={
            <Protected route="employee">
              <VisaStatusPage />
            </Protected>
          }
        />
        <Route
          path="/onboarding"
          element={
            <Protected route="employee">
              {/* 这里切到 UI 版，纯前端状态测试更直观 */}
              <OnboardingApplicationUI />
              {/* 若要切回真实页面，改为：
                  <OnboardingApplication />
               */}
            </Protected>
          }
        />
        <Route
          path="/personal-info"
          element={
            <Protected route="employee">
              <ProfileDetailPage mode="employee" />
            </Protected>
          }
        />

        {/* ---------- HR ---------- */}
        <Route
          path="/hr/home"
          element={
            <Protected route="hr">
              <HomePage />
            </Protected>
          }
        />
        <Route
          path="/hr/visa-management"
          element={
            <Protected route="hr">
              <VisaManagement />
            </Protected>
          }
        />
        <Route
          path="/hr/hiring"
          element={
            <Protected route="hr">
              <HiringManagement />
            </Protected>
          }
        />
        <Route
          path="/hr/profiles"
          element={
            <Protected route="hr">
              <Profiles />
            </Protected>
          }
        />
        <Route
          path="/hr/profiles/:id"
          element={
            <Protected route="hr">
              <ProfileDetailPage mode="hr" />
            </Protected>
          }
        />
        <Route
          path="/hr/application/:id"
          element={
            <Protected route="hr">
              <ProfileDetailPage mode="hr" />
            </Protected>
          }
        />

        {/* ---------- Dev-only (便捷本地联调 UI，无需登录守卫) ---------- */}
        <Route
          path="/dev/onboarding"
          element={<OnboardingApplicationUI />}
        />

        {/* ---------- Fallback ---------- */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}
