import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useSelector((state: RootState) => ({
    token: state.auth.token,
  }));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;