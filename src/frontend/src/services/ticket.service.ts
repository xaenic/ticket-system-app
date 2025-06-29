import type { IResponse } from "@/interfaces/IResponse";
import type { ITicket, PaginationParams, TicketFormData, UpdateTicketFormData, UserTicketsParams } from "@/interfaces/ITicket";
import type { AgentFields } from "@/interfaces/IUser";
import api from "@/utils/api";
import { AxiosError } from "axios";

// Type for common pagination and query parameters

export const getUserTickets = async ({
  page = 1,
  perPage=10,
  query = "",
  status = "",
  priority = ""
}: UserTicketsParams): Promise<IResponse<ITicket>> => {
  
  try {
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
  }catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      // Handle validation errors from backend
      const exception = error.response.data?.message;
      if (exception) {
        throw new Error(exception);
      }
      throw error.response.data.messages;
    }

    throw new Error("Something went wrong during fetching tickets");
  }
  
};
export const getOpenTickets = async ({
  page = 1,
  perPage,
  query = ""
}: PaginationParams): Promise<IResponse<ITicket>> => {

  try {
    const response = await api.get(
    `/tickets/open?query=${query}&page=${page}&per_page=${perPage}`
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch tickets");
    }

    return response.data;
  }catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      const exception = error.response.data?.message;
      if (exception) {
        throw new Error(exception);
      }
      throw error.response.data.messages;
    }

    throw new Error("Something went wrong during fetching tickets");
  }
  
};

export const addTicket = async ({
  title,
  description,
  priority,
  attachments,
  department_id,
}: TicketFormData): Promise<AgentFields | boolean> => {
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
    if (error instanceof AxiosError && error.response?.data) {
      // Handle validation errors from backend
      const exception = error.response.data?.message;
      if (exception) {
        throw new Error(exception);
      }
      throw error.response.data.messages;
    }
  
    throw new Error("Something went wrong during adding ticket");
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
}: UpdateTicketFormData): Promise<ITicket | boolean> => {
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
      // Handle validation errors from backend
      const exception = error.response.data?.message;
      if (exception) {
        throw new Error(exception);
      }
      throw error.response.data.messages;
    }
  
    throw new Error("Something went wrong during updating ticket");
  }
};

export const assignTicket = async (id: string) => {
  try {
    const response = await api.patch(`/tickets/${id}`);

    if (response.status !== 200 && response.status !== 204) {
      throw new Error("Failed to assign ticket");
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      // Handle validation errors from backend
      const exception = error.response.data?.message;
      if (exception) {
        throw new Error(exception);
      }
      throw error.response.data.messages;
    }

    throw new Error("Something went wrong during assigning ticket");
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
    if (error instanceof AxiosError && error.response?.data) {
      // Handle validation errors from backend
      const exception = error.response.data?.message;
      if (exception) {
        throw new Error(exception);
      }
      throw error.response.data.messages;
    }

    throw new Error("Something went wrong during updating ticket status");
  }

  return "Successfully updated ticket status";
};
