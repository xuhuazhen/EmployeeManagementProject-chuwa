import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from "./components/mainLayout/mainLayout";
import { AuthGuardForSignup } from './router/AuthGuard';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import HiringManagementPage from './pages/HiringManagement';


const App = () => {
  // return <MainLayout />;
  return (
    <Router>
      <Routes>
        <Route
          path='/signup/*'
          element={
            <AuthGuardForSignup>
              <SignupPage />
            </AuthGuardForSignup>
          }
        />
        <Route
          path='/login'
          element={
            <LoginPage />
          }
        />
        <Route 
          path='/hiringmanagement'
          element={
            <HiringManagementPage />
          }
        />
      </Routes>
    </Router>
)};

export default App;
