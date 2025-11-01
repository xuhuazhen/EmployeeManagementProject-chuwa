// client/src/router/RoleGuard.jsx
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const RoleGuard = ({ allowedRole, children }) => {
  const auth = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth.isLoggedIn) return; // 未登录交给 AuthGuard 处理

    // 角色拦截
    if (allowedRole && allowedRole !== auth.role) {
      if (auth.role === "hr") navigate("/hr/home", { replace: true });
      else navigate("/home", { replace: true });
      return;
    }

    // 员工自动导向
    if (auth.role === "employee") {
      const ns = auth.nextStep || "";
      const stage = ns.includes("-") ? ns.split("-")[0] : null;

      if (stage === "application") {
        if (location.pathname !== "/onboarding") {
          navigate("/onboarding", { replace: true });
        }
        return;
      }

      // 默认落到 /home
      if (["/login", "/"].includes(location.pathname)) {
        navigate("/home", { replace: true });
      }
      return;
    }

    // HR 默认首页
    if (auth.role === "hr") {
      if (location.pathname === "/" || location.pathname === "/login") {
        navigate("/hr/home", { replace: true });
      }
    }
  }, [auth.isLoggedIn, auth.role, auth.nextStep, location.pathname, navigate, allowedRole]);

  return children;
};

export default RoleGuard;
