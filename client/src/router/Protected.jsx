import { AuthGuard } from "./AuthGuard";
import RoleGuard from "./RoleGuard";

 
const Protected = ({ route, children }) => {
  return (
    <AuthGuard>
      <RoleGuard allowedRole={route}>
        {children}
      </RoleGuard>
    </AuthGuard>
  );
};

export default Protected;