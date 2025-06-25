import type { IAuthResponse } from "@/interfaces/auth/IAuthResponse";
import api from "@/utils/api";

export const loginService = async (
  email: string,
  password: string
): Promise<IAuthResponse> => {
  try {
    const response = await api.post("/login", { email, password });

    if (response.status === 401) throw Error("Invalid credentials");

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutService = async (): Promise<void> => {
  try {
    const response = await api.post("/logout");

    if (response.status !== 200) {
      throw new Error("Failed to logout");
    }
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const isLoggedIn = (): boolean => {
  // Check if user is authenticated
  try {
    // This is a simple check that can be enhanced with token validation logic
    const savedAuth = localStorage.getItem("auth_state");
    if (!savedAuth) return false;

    const { expiry } = JSON.parse(savedAuth);
    if (expiry && new Date(expiry).getTime() > new Date().getTime()) {
      return true;
    }

    // Clear expired auth state
    localStorage.removeItem("auth_state");
    return false;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

export const storeAuthState = (token: string): void => {
  localStorage.setItem("token", token);
};
export const clearAuthState = (): void => {
  localStorage.removeItem("token");
};

export const checkStatus = async (): Promise<IAuthResponse> => {
  const response = await api.get("/me");
  if (response.status !== 200) {
    throw new Error("Failed to fetch user data");
  }
  return response.data;
};
