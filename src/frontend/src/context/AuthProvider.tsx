import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import {
  checkStatus,
  clearAuthState,
  loginService,
  logoutService,
  storeAuthState,
} from "@/services/auth.service";
import type { IUser } from "@/interfaces/IUser";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");

      if (!token) return setIsLoading(false);
      try {
        setIsLoading(true);
        const { user: userData, token } = await checkStatus();
        setUser(userData);
        setIsAuthenticated(true);
        if (token) storeAuthState(token);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        clearAuthState();
        console.error("Authentication check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {

      const { user, token } = await loginService(email, password);
      setUser(user);
      setIsAuthenticated(true);
      if (token) storeAuthState(token);
  
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutService();
      setUser(null);
      setIsAuthenticated(false);
      // Clear auth state from localStorage
      clearAuthState();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
