import { PageLoader } from "@/components/ui/pageLoader";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ role }: { role: string }) => {
  const { user, isLoading } = useAuth();
  if (!user && !isLoading) return <Navigate to={"/login"} replace />;
  if (user && user.role !== role)
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  if(isLoading) return <PageLoader/>
  return <Outlet />;
};
