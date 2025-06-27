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
    `/tickets?query=${query}&status=${status.replace(
      "all",
      ""
    )}&priority=${priority.replace("all", "")}&page=${page}&per_page=${perPage}`
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch tickets");
  }

  return response.data;
};
export const getOpenTickets = async (
  page: number = 1,
  perPage: string,
  query: string = ""
): Promise<IResponse<ITicket>> => {
  const response = await api.get(
    `/tickets/open?query=${query}&page=${page}&per_page=${perPage}`
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
  try {
    const response = await api.post(
      "/tickets",
      {
        title,
        description,
        priority,
        attachments,
        department_id,
      },
      {
        headers: { "Content-Type": "multipart/form-data" },
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
    throw new Error("Failed to add ticket");
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
    if (error instanceof AxiosError && error.response) {
      const msg = error.response.data.messages;
      const exception = error.response.data.message;

      if (exception) throw new Error(exception);
      //execption error from backend

      return msg;
    }

    throw new Error("Failed to update ticket");
  }
};

export const assignTicket = async (id: string) => {
  try {
    const response = await api.patch(`/tickets/${id}`);

    if (response.status !== 200 && response.status !== 204) {
      throw new Error("Failed to assign ticket");
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const msg = error.response.data.messages;
      const exception = error.response.data.message;

      if (exception) throw new Error(exception);
      return msg;
    }
    throw new Error("Failed to assign ticket");
  }

  return "Successfully assigned ticket";
};

export const updateTicketStatus = async (status: string, id: string) => {
  try {
    const response = await api.patch(
      `/tickets/status/${id}`,
      { status } // data payload
    );

    if (response.status !== 200 && response.status !== 204) {
      throw new Error("Failed to update ticket status");
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const msg = error.response.data.messages;
      const exception = error.response.data.message;

      if (exception) throw new Error(exception);
      return msg;
    }
    throw new Error("Failed to update ticket status");
  }

  return "Successfully updated ticket status";
};
