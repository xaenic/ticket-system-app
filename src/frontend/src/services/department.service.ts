import type { IDepartment } from "@/interfaces/IDepartment";
import type { IResponse } from "@/interfaces/IResponse";
import api from "@/utils/api";
import { AxiosError } from "axios";

export const getDepartments = async (
  page: number = 1,
  perPage: string,
  query: string = ""
): Promise<IResponse<IDepartment>> => {
  const response = await api.get(
    `/departments?query=${query}&page=${page}&per_page=${perPage}`
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch departments");
  }

  return response.data;
};

export const addDepartment = async (name: string) => {
  const response = await api.post("/departments", { name });

  if (response.status !== 201) {
    throw new Error("Failed to add department");
  }

  return "Successfully added department";
};

export const updateDepartment = async (name: string, id: string) => {
  try {
    const response = await api.put(`/departments/${id}`, { name });

    if (response.status !== 200 && response.status !== 204) {
      throw new Error("Failed to update department");
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 422) {
      const msg = error.response.data.messages['name'];
      throw new Error(msg);
    }
  }

  return "Successfully updated department";
};


export const deleteDepartment = async (id: string) => {
  try {
    const response = await api.delete(`/departments/${id}`);

    if (response.status !== 200 && response.status !== 204) {
      throw new Error("Failed to delete department");
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 422) {
      const msg = error.response.data.messages['name'];
      throw new Error(msg);
    }
  }

  return "Successfully deleted department";
};
