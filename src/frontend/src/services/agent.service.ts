import type { IResponse } from "@/interfaces/IResponse";
import type { AgentFields, IUser } from "@/interfaces/IUser";
import api from "@/utils/api";
import { AxiosError } from "axios";

export const getAgents = async (
  page: number = 1,
  perPage: string,
  query: string = ""
): Promise<IResponse<IUser>> => {
  const response = await api.get(
    `/users/agents?query=${query}&page=${page}&per_page=${perPage}`
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch departments");
  }

  return response.data;
};

export const addAgent = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  department_id: string
): Promise<AgentFields | boolean> => {
  try {
    const response = await api.post("/users", {
      name,
      email,
      password,
      password_confirmation: confirmPassword,
      department_id,
    });

    if (response.status !== 201) {
      throw new Error("Failed to add agent");
    }

    return true;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 422) {
      const msg = error.response.data.messages;
      return msg;
    }
    throw new Error("Failed to add agent");
  }
};

export const updateAgent = async (
  name: string,
  id: string,
  department_id: string
): Promise<AgentFields | boolean> => {
  try {
    const response = await api.put(`/users/${id}`, { name, department_id });

    if (response.status !== 200 && response.status !== 204) {
      throw new Error("Failed to update department");
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 422) {
      const msg = error.response.data.messages;
      return msg;
    }
    throw new Error("Failed to update agent");
  }

  return true;
};

export const deleteAgent = async (id: string) => {
  try {
    const response = await api.delete(`/users/${id}`);

    if (response.status !== 200 && response.status !== 204) {
      throw new Error("Failed to delete agent");
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 422) {
      const msg = error.response.data.messages["name"];
      throw new Error(msg);
    }
    throw new Error("Failed to delete agent");
  }

  return "Successfully deleted agent";
};
