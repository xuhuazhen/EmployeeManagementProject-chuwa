import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./components/mainLayout/mainLayout";
import { AuthGuardForSignup } from "./router/AuthGuard";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import Profiles from "./pages/Profiles/Profiles";
import VisaManagement from "./pages/VisaManagement/VisaManagement";
import HiringManagement from "./pages/Hiring/HiringManagement";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/signup/*"
          element={
            <AuthGuardForSignup>
              <SignupPage />
            </AuthGuardForSignup>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profiles" element={<Profiles />} />
        {/* <Route path="/profiles/:id" element={<EmployeeDetail />} /> */}
        <Route path="/visamanagement" element={<VisaManagement />} />
        <Route path="/hiringmanagement" element={<HiringManagement />} />
      </Routes>
    </Router>
  );
};

export default App;
