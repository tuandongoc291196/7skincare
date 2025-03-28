// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { login, registerUser } from "@/apis/auth";
import { LoginData, RegisterUserData, UpdateAccountData, User } from "@/types/schema/user";

// Define the auth store interface
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginData) => Promise<void>;
  registerUser: (data: RegisterUserData) => Promise<void>;
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
          set({
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
