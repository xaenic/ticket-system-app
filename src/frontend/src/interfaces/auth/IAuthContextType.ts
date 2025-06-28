import  { type IUser } from "../IUser";

export interface IAuthContextType {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string, avatar?: File | null) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;

}
