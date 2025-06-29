import type { IMessageResponse } from "@/interfaces/IMessage";
import type { INotification } from "@/interfaces/INotification";
import type { IResponse } from "@/interfaces/IResponse";
import type { PaginationParams } from "@/interfaces/ITicket";
import api from "@/utils/api";
import { AxiosError } from "axios";

export const getNotifications = async ({
  page = 1,
  perPage = 10,
  status = "all",
}: PaginationParams): Promise<IResponse<INotification>> => {
  try {
    const response = await api.get(
      `/notifications/${status}/?page=${page}&per_page=${perPage}`
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch notifications");
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

    throw new Error("Something went wrong during fetching notifications");
  }
};
export const getMessages = async (): Promise<IMessageResponse> => {
  try {
    const response = await api.get(
      `/messages`
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch messages");
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

    throw new Error("Something went wrong during fetching messages");
  }
};

export const markNotificationRead = async (id: string) => {
  try {
    const response = await api.patch(`/notifications/${id}/read`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch notifications");
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

    throw new Error("Something went wrong during fetching notifications");
  }
};
