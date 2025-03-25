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
  clearToken: () => void;
  clearUserType: () => void;
}

export const useStore = create<StoreState>((set) => ({
  token: null,
  user: null,
  userType: null,
  setToken: (token) => set({ token, user: jwtDecode(token) }),
  setUserType: (type) => set({ userType: type }),
  clearToken: () => set({ token: null, user: null }),
  clearUserType: () => set({ userType: null }),
}));
