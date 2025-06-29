import type { IResponse } from "@/interfaces/IResponse";
import type { ITicket, TicketPriority } from "@/interfaces/ITicket";
import type { AgentFields } from "@/interfaces/IUser";
import api from "@/utils/api";
import { AxiosError } from "axios";

export const addResponse = async ({
  message,
  attachments,
  ticket_id,
}: {
  message: string;
  attachments?: File[];
  ticket_id: string;
}): Promise<AgentFields | boolean> => {
  try {
    const response = await api.post(
      "/tickets/responses",
      {
        message,
        attachments,
        ticket_id,
      },
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (response.status !== 201) {
      throw new Error("Failed to add response");
    }
    return true;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      const exception = error.response.data.message;
      if (exception) throw new Error(exception);
     throw error.response.data.messages;
    }
    throw new Error("Failed to add response");
  }
};
export const getTicket = async (id: string): Promise<IResponse<ITicket>> => {
  const response = await api.get(`/tickets/${id}`);

  return response.data;
};

export const updateTicket = async ({
  id,
  title,
  description,
  priority,
  attachments,
  department_id,
  deleted_files,
}: {
  id: string;
  title: string;
  description: string;
  deleted_files: string[];
  priority: TicketPriority;
  attachments?: File[];
  department_id: string;
}): Promise<ITicket | boolean> => {
  try {
    const response = await api.post(
      `/tickets/${id}`,
      {
        title,
        description,
        priority,
        new_attachments: attachments,
        deleted_files: deleted_files,
        department_id,
      },
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (response.status !== 200 && response.status !== 204) {
      throw new Error("Failed to update ticket");
    }

    return true;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      const msg = error.response.data.messages;
      const exception = error.response.data.message;

      if (exception) throw new Error(exception);
      //execption error from backend

      return msg;
    }

    throw new Error("Failed to update ticket");
  }
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
