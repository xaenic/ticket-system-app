import type { IDepartment } from "@/interfaces/IDepartment";
import type { IResponse } from "@/interfaces/IResponse";
import api from "@/utils/api";

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

  return response.data
};
