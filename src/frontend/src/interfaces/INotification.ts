import type { IResponse } from "./IResponse";
import type { IUser } from "./IUser";

export interface INTicket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  client_id: number;
  client: IUser;
  assigneduser: IUser | null;
  department_id: number;
  assigned_user_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface INResponse {
  id: number;
  message: string;
  user: IUser | null;
  ticket: INTicket;
  created_at: string;
  updated_at: string;
  unread_count: number;

}

export interface INotification {
  id: string;
  message: string;
  ticket?: INTicket;
  read_at: string | null;
  created_at: string;
  response?: INResponse;
}
