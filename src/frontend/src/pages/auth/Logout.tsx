import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export const Logout = () => {
  const { logout } = useAuth();
  useEffect(() => {
    logout();

  }, [logout]);
  return  <Navigate to={'/login'} />;
};
