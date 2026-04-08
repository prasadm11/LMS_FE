import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

type Props = {
  children: React.ReactNode;
  role?: string;
};

const ProtectedRoute = ({ children, role }: Props) => {
  const user = getUserFromToken();

  //  No user
  if (!user) {
    return <Navigate to="/" replace />;
  }

  //  Role mismatch
  if (role && user.role !== role) {
    return user.role === "Admin"
      ? <Navigate to="/admin-dashboard" replace />
      : <Navigate to="/user-dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;