import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ role }: { role: string }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to={"/login"} replace />;
  if (user.role !== role)
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  return <Outlet />;
};
