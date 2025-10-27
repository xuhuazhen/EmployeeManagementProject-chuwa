import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react'; 
import LoadingSpin from '../components/LoadingSpin/loadingSpin';
import api from '../api/axiosConfig';
import SignupPage from '../pages/Signup';

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
    // AuthGuard, 
    AuthGuardForSignup };
