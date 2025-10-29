import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'; 
import LoadingSpin from '../components/LoadingSpin/loadingSpin';
import api from '../api/axiosConfig';
import SignupPage from '../pages/Signup';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';

const AuthGuard = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user); 
  const dispatch = useDispatch();

  const checkLoginStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('user/login', {
        withCredentials: true,
      });

      setIsLoggedIn(response.data.isLogin);
      
      if ( !isLoggedIn && 
         location.pathname !== '/login' && location.pathname !== '/signup' ) {
            // Redirect unauthenticated users
            navigate('/login');
        }
    } catch (error) {
      console.error('Authentication check failed:', error);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, navigate, location.pathname]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        const nextStep = user.nextStep?.split('-')[0];
        switch (nextStep) {
          case 'application':
            navigate('/application'); //或者/onboarding
            break;
          default:
            if (['/login', '/'].includes(location.pathname)) {
            //   navigate('/?'); // Default redirect for logged-in users
            }
            break;
        }
      } else if (location.pathname !== '/signup') {
        navigate('/login');
      }
    }
  }, [isLoggedIn, isLoading, user.nextStep, location.pathname, navigate]);

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
