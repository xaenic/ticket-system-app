import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { PageLoader } from "@/components/ui/pageLoader";
export default function GuestRoute() {
  const { user, isLoading } = useAuth();
  if (user) return <Navigate to={`/${user.role}/dashboard`} replace />;

  if (isLoading) return <PageLoader />;
  return <Outlet />;
}
