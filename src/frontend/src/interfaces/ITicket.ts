import type { IDepartment } from "./IDepartment";
import type { IUser } from "./IUser";

export interface ITicket {
  id?: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority | undefined;
  client_id: number;
  client: IUser;
  department_id: number;
  department: IDepartment
  assigned_user_id?: number | null;
  created_at?: string;
  updated_at?: string;
  assigneduser: IUser | null;
  attachments?: Attachment[] | File[];
  responses?: TicketResponse[];
}

export type TicketResponse = {
  id: number;
  message: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  user: IUser
  attachments?: Attachment[];
}

export type Attachment = {
  id: number;
  filename: string;
  file_path: string;
  extension: string;
  mime_type: string;
  size: number;
  ticket_id: number;
  response_id?: number | null;
  created_at: string;
  updated_at: string;
  uploaded_by?: IUser;
  File: File;
};
export type TicketStatus =
  | "open"
  | "in_progress"
  | "pending"
  | "resolved"
  | "closed";

export type TicketPriority = "low" | "medium" | "high";

// Constants for ticket status values
export const TICKET_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  PENDING: "pending",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const;

// Constants for ticket priority values
export const TICKET_PRIORITY = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  URGENT: "urgent",
  CRITICAL: "critical",
} as const;

// Optional: Interface for creating a new ticket (without id and timestamps)
export interface ICreateTicket {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  client_id: number;
  department_id: number;
  assigned_user_id?: number | null;
}

// Optional: Interface for updating a ticket (all fields optional except id)
export interface IUpdateTicket {
  id: number;
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  client_id?: number;
  department_id?: number;
  assigned_user_id?: number | null;
}

export type PaginationParams = {
  page?: number;
  perPage: number;
  query?: string;
};

// Type for user tickets with additional filters
export type UserTicketsParams = PaginationParams & {
  status?: string;
  priority?: string;
};

// Type for common ticket form data
export type TicketFormData = {
  title: string;
  description: string;
  priority: TicketPriority;
  attachments?: File[];
  department_id: string;
};

// Type for update ticket form data (extends base with additional fields)
export type UpdateTicketFormData = TicketFormData & {
  id: string;
  deleted_files: string[];
};
