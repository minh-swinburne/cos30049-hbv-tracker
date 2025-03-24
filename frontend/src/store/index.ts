import { create } from "zustand";

interface StoreState {
  token: string | null;
  userType: "healthcareProvider" | "researcher" | "generalUser" | null;
  setToken: (token: string) => void;
  setUserType: (type: "healthcareProvider" | "researcher" | "generalUser") => void;
  clearToken: () => void;
  clearUserType: () => void;
}

export const useStore = create<StoreState>((set) => ({
  token: null,
  userType: null,
  setToken: (token) => set({ token }),
  setUserType: (type) => set({ userType: type }),
  clearToken: () => set({ token: null }),
  clearUserType: () => set({ userType: null }),
}));
