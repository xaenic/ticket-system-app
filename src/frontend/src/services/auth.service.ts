import type { IAuthResponse } from "@/interfaces/auth/IAuthResponse";
import api from "@/utils/api";
import { AxiosError } from "axios";

export const loginService = async (
  email: string,
  password: string
): Promise<IAuthResponse> => {
  try {
    const response = await api.post("/login", { email, password });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Login failed");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      // Handle validation errors from backend
      const exception = error.response.data?.message;
      if (exception) {
        throw new Error(exception);
      }
      throw error.response.data.messages;
    }

    throw new Error("Something went wrong during login");
  }
};

export const logoutService = async (): Promise<void> => {
  try {
    const response = await api.post("/logout");

    if (response.status !== 200) {
      throw new Error("Failed to logout");
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      // Handle validation errors from backend
      const exception = error.response.data?.message;
      if (exception) {
        throw new Error(exception);
      }
      throw error.response.data;
    }
    throw new Error("Something went wrong during logout");
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
  try {
    const response = await api.get("/me");

    if (response.status !== 200) {
      throw new Error("Failed to fetch user data");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      // Handle validation errors from backend
      throw error.response.data;
    }
    throw new Error("Something went wrong while checking status");
  }
};

export const registerService = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  avatar: File | null
): Promise<IAuthResponse> => {
  try {

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", confirmPassword ?? "");

    if (avatar != null) {
      formData.append("avatar", avatar);
    }
    const response = await api.post(
      "/register",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Registration failed");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      const exception = error.response.data?.message;
      if (exception) {
        throw new Error(exception);
      }
      throw error.response.data.messages;
    }
    throw new Error("Something went wrong during registration");
  }
};

export const updateProfile = async (
  name: string,
  password: string,
  new_password: string | null,
  avatar: File | null
): Promise<IAuthResponse> => {

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("password", password);
    formData.append("new_password", new_password ?? "");
    formData.append("asdsadsads", new_password ?? "");

    if (avatar != null) {
      formData.append("avatar", avatar);
    }

    const response = await api.post("users/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Registration failed");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      const exception = error.response.data?.message;
      if (exception) {
        throw new Error(exception);
      }
      throw error.response.data.messages;
    }
    throw new Error("Something went wrong during registration");
  }
};
