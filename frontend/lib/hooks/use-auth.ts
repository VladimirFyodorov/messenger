import {
  useCallback,
  useEffect,
} from 'react';

import { useRouter } from 'next/navigation';

import {
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import { apiClient } from '../api/client';
import {
  AuthResponseSchema,
  UserSchema,
} from '../dto/auth.dto';
import { useAuthStore } from '../store/auth.store';

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiClient
        .post('auth/register', { json: data })
        .json();
      return AuthResponseSchema.parse(response);
    },
    onSuccess: (data) => {
      setAuth(data.accessToken, data.refreshToken, data.user);
      router.push('/');
    },
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiClient
        .post('auth/login', { json: data })
        .json();
      return AuthResponseSchema.parse(response);
    },
    onSuccess: (data) => {
      setAuth(data.accessToken, data.refreshToken, data.user);
      router.push('/');
    },
  });
};

export const useGoogleAuth = () => {
  return useCallback(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    window.location.href = `${API_URL}/auth/google`;
  }, []);
};

export const useAutoAuth = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const shouldAutoAuth = Boolean(refreshToken) && !user;

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['user', 'me', accessToken, refreshToken],
    queryFn: async () => {
      const response = await apiClient.get('users/me').json();
      return UserSchema.parse(response);
    },
    enabled: shouldAutoAuth || (!!accessToken && !user),
    retry: false,
    retryOnMount: false,
  });

  // Обновляем store когда получили данные пользователя
  useEffect(() => {
    if (userData && !user) {
      // const currentAccessToken = useAuthStore.getState().accessToken;
      // const currentRefreshToken = useAuthStore.getState().refreshToken;
      // if (currentAccessToken && currentRefreshToken) {
      //   setAuth(currentAccessToken, currentRefreshToken, userData);
      // }
    }
  }, [userData, user, setAuth]);

  // Если запрос завершился с ошибкой и есть refreshToken, но нет пользователя
  // Пытаемся сделать refresh через afterResponse hook (он сработает автоматически)
  // Если это не помогло, очищаем auth
  useEffect(() => {
    if (error && shouldAutoAuth && !user) {
      // Даем время afterResponse hook попытаться сделать refresh
      // const timer = setTimeout(() => {
      //   const currentUser = useAuthStore.getState().user;
      //   const currentAccessToken = useAuthStore.getState().accessToken;
      //   // Если после ошибки все еще нет пользователя и accessToken - очищаем
      //   if (!currentUser && !currentAccessToken) {
      //     clearAuth();
      //   }
      // }, 1000);
      // return () => clearTimeout(timer);
    }
  }, [error, shouldAutoAuth, user, clearAuth]);

  return { 
    isLoading: isLoading || false, 
    user: user || userData || null 
  };
};
