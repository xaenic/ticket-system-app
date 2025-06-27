
import type { IDepartment } from "./IDepartment";

export interface IUser {
  id:string
  name: string;
  email: string;
  role?: string;
  department?: IDepartment
  avatar:string;
}


export interface AgentFields {

  name:string;
  email?:string;
  password?:string;
  confirmPassword?: string;
  department_id:string;
}