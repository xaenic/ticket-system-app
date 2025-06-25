import { createContext } from "react";

import type { IAuthContextType } from "@/interfaces/auth/IAuthContextType";

export const AuthContext = createContext<IAuthContextType | undefined>(
  undefined
);
