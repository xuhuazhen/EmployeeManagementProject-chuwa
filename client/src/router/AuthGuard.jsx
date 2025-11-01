// client/src/router/AuthGuard.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import LoadingSpin from "../components/LoadingSpin/loadingSpin";
import api from "../api/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../slices/authSlice";
import { initUserThunk } from "../thunks/employeeThunk";

const AuthGuard = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const checkLoginStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      // 注意：带前导斜杠
      const response = await api.get("/user/login", { withCredentials: true });
      const cur = response.data;

      if (cur?.isLogin) {
        if (!user.userID) {
          // 把 nextStep 也写入
          dispatch(
            login({
              userID: cur.userId,
              username: cur.username,
              role: cur.role,
              nextStep: cur.nextStep,
            })
          );
          if (cur.role === "employee" && cur.userId) {
            dispatch(initUserThunk(cur.userId));
          }
        }
        // 已登录不强制跳转，交由 RoleGuard 处理
      } else if (!["/login", "/signup"].some((p) => location.pathname.startsWith(p))) {
        navigate("/login", { replace: true });
      }
    } catch (e) {
      navigate("/login", { replace: true });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, user.userID, navigate, location.pathname]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  if (isLoading) return <LoadingSpin />;

  return children;
};

const AuthGuardForSignup = ({ children }) => children; // 你已有的实现即可，这里不动

export { AuthGuard, AuthGuardForSignup };
