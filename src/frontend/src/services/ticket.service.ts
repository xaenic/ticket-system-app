import type { IResponse } from "@/interfaces/IResponse";
import type { ITicket, TicketPriority } from "@/interfaces/ITicket";
import type { AgentFields } from "@/interfaces/IUser";
import api from "@/utils/api";
import { AxiosError } from "axios";

export const getUserTickets = async (
  page: number = 1,
  perPage: string,
  query: string = "",
  status: string = "",
  priority: string = ""
): Promise<IResponse<ITicket>> => {
  const response = await api.get(
    `/tickets?query=${query}&status=${status.replace("all","")}&priority=${priority.replace("all","")}&page=${page}&per_page=${perPage}`
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch tickets");
  }

  return response.data;
};

export const addTicket = async ({
  title,
  description,
  priority,
  attachments,
  department_id,
}: {
  title: string;
  description: string;
  priority: TicketPriority;
  attachments?: File[];
  department_id: string;
}): Promise<AgentFields | boolean> => {
  console.log(attachments)
  try {

    api.defaults.headers.common["Content-Type"] = "multipart/form-data";
    const response = await api.post("/tickets", {
      title,
      description,
      priority,
      attachments,
      department_id,
    }
    
  );

    if (response.status !== 201) {
      throw new Error("Failed to add ticket");
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
