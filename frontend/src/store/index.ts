import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

interface User {
  sub: string;
  contract: string;
  iat: number;
  exp: number;
}

interface StoreState {
  token: string | null;
  user: User | null;
  userType: "healthcareProvider" | "researcher" | "patient" | null;
  setToken: (token: string) => void;
  setUserType: (type: "healthcareProvider" | "researcher" | "patient") => void;
}

export const useStore = create<StoreState>((set) => ({
  token: null,
  user: null,
  userType: null,
  setToken: (token) => {
    const decodedUser: User = jwtDecode(token);
    set({ token, user: decodedUser });
  },
  setUserType: (type) => set({ userType: type }),
}));
