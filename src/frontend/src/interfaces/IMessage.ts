import type { IUser } from "./IUser";

export interface IResponseData {
  ticket_id: string;
  message: string;
  user_id: number;
  updated_at: string;
  created_at: string;
  id: number;
  user: IUser;
}

export interface INotificationMessage {
  id: string;
  message: string;
  user: IUser;
  response: IResponseData;
  read_at: string | null;
  created_at: string;
}

export interface IMessage {
  user_id: number;
  notification: INotificationMessage;
  unread_count: number;
}

export interface IMessageResponse {
  data: IMessage[];
}


