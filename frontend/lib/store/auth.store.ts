import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
} from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  googleId?: string | null;
  settings?: Record<string, any>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  sessionToken: string | null;
  user: User | null;
  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  setAccessToken: (accessToken: string) => void;
  setSessionToken: (sessionToken: string | null) => void;
  clearAuth: () => void;
}

const getStorage = () => {
  if (typeof window !== 'undefined') {
    return localStorage;
  }
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      sessionToken: null,
      user: null,
      isExchangeDenied: false,
      setAuth: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setSessionToken: (sessionToken) => set({ sessionToken }),
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          sessionToken: null,
          user: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => getStorage()),
    }
  )
);

// Helper functions for non-React contexts
export const getAccessToken = (): string | null => {
  return useAuthStore.getState().accessToken;
};

export const getRefreshToken = (): string | null => {
  return useAuthStore.getState().refreshToken;
};

export const getSessionToken = (): string | null => {
  return useAuthStore.getState().sessionToken;
};

export const setAccessToken = (accessToken: string): void => {
  useAuthStore.getState().setAccessToken(accessToken);
};

export const setSessionToken = (sessionToken: string | null): void => {
  useAuthStore.getState().setSessionToken(sessionToken);
};
