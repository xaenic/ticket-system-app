import { type IUser } from "../IUser";
export interface IAuthResponse {
  user: IUser | null;
  message: string;
  token?: string
}