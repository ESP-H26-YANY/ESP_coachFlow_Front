import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RoleRouteProps {
  allowedRoles: string[];
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "coach" ? "/coach/dashboard" : "/user/dashboard"} replace />;
  }

  return <Outlet />;
}