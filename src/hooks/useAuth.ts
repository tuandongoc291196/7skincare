// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { login, registerUser, registerStaff } from "@/apis/auth";
import {
  LoginData,
  RegisterStaffData,
  RegisterUserData,
  UpdateAccountData,
  User,
} from "@/types/schema/user";

// Define the auth store interface
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginData) => Promise<void>;
  registerUser: (data: RegisterUserData) => Promise<void>;
  registerStaff: (data: RegisterStaffData) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  updateUser: (updatedData: UpdateAccountData) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginData) => {
        try {
          set({ isLoading: true });
          const user = await login(credentials);
          set({
            user: user.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
          });
          throw error;
        }
      },

      registerUser: async (data: RegisterUserData) => {
        try {
          set({ isLoading: true });
          await registerUser(data);
          const user = await login({ email: data.email, password: data.password });
          set({
            user: user.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
          });
          throw error;
        }
      },

      registerStaff: async (data: RegisterStaffData) => {
        try {
          set({ isLoading: true });
          await registerStaff(data);
          const user = await login({ email: data.email, password: data.password });
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      checkAuth: () => {
        const { user } = get();
        return !!(user && user.token);
      },
      updateUser: (updatedData: UpdateAccountData) => {
        set(state => ({
          user: state.user
            ? {
                ...state.user,
                name: updatedData.name,
                phoneNumber: updatedData.phoneNumber,
                accountId: updatedData.id,
                email: updatedData.email,
              }
            : null,
        }));
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
