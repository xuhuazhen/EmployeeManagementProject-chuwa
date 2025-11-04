import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const RoleGuard = ({ allowedRole, children }) => {
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("chekcing user role ......", user.role);
    // 如果角色不匹配，直接拦截
    if (user.isLoggedIn && allowedRole && allowedRole !== user.role) {
      navigate('/err');
      return;
    }
    // employee的登录后导向逻辑
    if (user.role === 'employee') {
      const nextStep = user.nextStep?.split('-')[0];
      console.log(user.nextStep);
      switch (nextStep) {
        case 'application':
            navigate('/onboarding');
          break;
        default:
          if (['/login', '/', '/onboarding'].includes(location.pathname)) {
            navigate('/home');
          }
          break;
      } 
    }

    // HR的默认跳转逻辑
    if (user.role === 'hr') {
      if (location.pathname === '/' || location.pathname === '/login') {
        console.log("redirect..");
        navigate('/hr/home');
      }
    }
  }, [user.role, user.nextStep, user.isLoggedIn, navigate]);

  return children;
};

export default RoleGuard;
