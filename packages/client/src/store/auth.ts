import type { User } from "@game-forge/shared";
import { create } from "zustand";

interface UserStore {
  user: User | null;
  setUser: (user: User|null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<UserStore>((set) => ({
  user: null,
  setUser(user) {
    return set({ user });
  },
  clearUser() {
    return set({ user: null });
  },
}));
