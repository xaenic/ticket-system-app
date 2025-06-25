import { type User } from "../IUser";
export interface IAuthResponse {
  user: User | null;
  message: string;
  token?: string
}