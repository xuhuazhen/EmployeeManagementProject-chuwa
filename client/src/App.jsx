// client/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OnboardingApplication from "./pages/OnboardingApplication";
import { AuthGuardForSignup } from "./router/AuthGuard";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import HiringManagement from "./pages/Hiring/HiringManagement";
import VisaManagement from "./pages/VisaManagement/VisaManagement";
import HomePage from "./pages/Home";
import Protected from "./router/Protected";
import VisaStatusPage from "./pages/VisaStatus";
import ProfileDetailPage from "./pages/ProfileDetail";
import ErrorPage from "./pages/ErrorPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 登录页不加 Protected，避免循环 */}
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/signup/*"
          element={
            <AuthGuardForSignup>
              <SignupPage />
            </AuthGuardForSignup>
          }
        />

        {/* ----------- 员工页面 ---------- */}
        <Route
          path="/visa-status"
          element={
            <Protected route="employee">
              <VisaStatusPage />
            </Protected>
          }
        />
        <Route
          path="/home"
          element={
            <Protected route="employee">
              <HomePage />
            </Protected>
          }
        />
        <Route
          path="/onboarding"
          element={
            <Protected route="employee">
              <OnboardingApplication />
            </Protected>
          }
        />
        <Route
          path="/personal-info"
          element={
            <Protected route="employee">
              <ProfileDetailPage mode={"employee"} />
            </Protected>
          }
        />

        {/* ------------- HR 页面 ---------- */}
        <Route
          path="/hr/hiring"
          element={
            <Protected route="hr">
              <HiringManagement />
            </Protected>
          }
        />
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
          path="/hr/profiles/:id"
          element={
            <Protected route="hr">
              <ProfileDetailPage mode={"hr"} />
            </Protected>
          }
        />

        {/* 错误页面 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}
