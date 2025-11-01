import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'; 
import LoadingSpin from '../components/LoadingSpin/loadingSpin';
import api from '../api/axiosConfig';
import SignupPage from '../pages/Signup';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { login } from '../slices/authSlice'; 
import { initUserThunk } from '../thunks/employeeThunk';

const AuthGuard = ({ children }) => { 
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth); 
  const dispatch = useDispatch();

  const checkLoginStatus = useCallback(async () => {
    console.log("chekcing login status ......to page:", children);
    setIsLoading(true);
    try {
      const response = await api.get('user/login', {
        withCredentials: true,
      });
 
      const curUser = response.data;
        console.log(response.data.isLogin, curUser);
      if (response.data.isLogin) {
        // 已登录保存当前登录的user信息
        if (!user.userID) {
            dispatch(login({ userID: curUser.userId, username: curUser.username, role: curUser.role, nextStep: curUser.nextStep }));
            console.log('dispatch')
            if (curUser.role === 'employee')  dispatch(initUserThunk(curUser.userId));
        } 
      } else if ( location.pathname !== '/login' && location.pathname !== '/signup' ) {
            console.log('Redirect unauthenticated users');
            // Redirect unauthenticated users
            navigate('/login');
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, user.userID, navigate, location.pathname]);

  // 组件加载时执行登录检查
  useEffect(() => { 
    checkLoginStatus();
  }, [checkLoginStatus]);

  // //登录状态变化时处理跳转逻辑
  // useEffect(() => {
  //   if (!isLoading) {
  //       if (!user.isLoggedIn) {
  //       // 未登录的情况下，除 signup 外都跳回 login
  //           if (location.pathname !== '/signup') navigate('/login');
  //           return;
  //       }
        
  //       const nextStep = user.nextStep?.split('-')[0];
  //       switch (nextStep) {
  //         case 'application':
  //           navigate('/onboarding'); 
  //           break;
  //         default:
  //           if (['/login', '/'].includes(location.pathname)) {
  //             navigate('/home'); // Default redirect for logged-in users
  //           }
  //           break;
  //       }
 
  //   }
  // }, [user, isLoading, user.nextStep, location.pathname, navigate]);

  if (isLoading) {
    return <LoadingSpin />
  }

  return children;
};

// url with token sent to employee
const AuthGuardForSignup = () => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const currentPath = useLocation().pathname;
  const token = currentPath.split('signup/')[1];

  // valid token
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(
          `user/signup/${token}`
        );

        const isValid = response.data.isValid;
        const email = response.data.email;
        setIsTokenValid(isValid);
        setEmail(email);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [token]);

  if (isLoading) return <LoadingSpin />;
  else {
    if (!isTokenValid) {
        console.log('!token is not valid!')
    //   return <Navigate to='/error' />; // should redirect to error page, not implemented
    } else {
      return <SignupPage signupEmail={email} signupToken={token} />;
    }
  }
};

export { 
    AuthGuard, 
    AuthGuardForSignup };
