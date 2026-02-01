'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  useGoogleAuth,
  useLogin,
  useRegister,
} from '@/lib/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
});

const registerSchema = loginSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === 'register';
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const handleGoogleAuth = useGoogleAuth();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = isRegister ? registerMutation : loginMutation;

  const onSubmitLogin = (data: LoginFormData) => {
    console.log('onSubmitLogin', data);
    loginMutation.mutate(data);
  };

  const onSubmitRegister = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  const onSubmit = isRegister
    ? registerForm.handleSubmit(onSubmitRegister)
    : loginForm.handleSubmit(onSubmitLogin);

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...(isRegister ? registerForm.register('email') : loginForm.register('email'))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          {(isRegister ? registerForm.formState.errors.email : loginForm.formState.errors.email) && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {(isRegister ? registerForm.formState.errors.email : loginForm.formState.errors.email)?.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            {...(isRegister ? registerForm.register('password') : loginForm.register('password'))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          {(isRegister ? registerForm.formState.errors.password : loginForm.formState.errors.password) && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {(isRegister ? registerForm.formState.errors.password : loginForm.formState.errors.password)?.message}
            </p>
          )}
        </div>

        {isRegister && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Подтвердите пароль
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...registerForm.register('confirmPassword')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            {registerForm.formState.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{registerForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>
        )}

        {mutation.isError && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md dark:bg-red-900/20 dark:text-red-400">
            {mutation.error instanceof Error ? mutation.error.message : 'Произошла ошибка'}
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? 'Загрузка...' : isRegister ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 dark:bg-gray-900 dark:text-gray-400">Или</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleAuth}
          className="mt-4 w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {isRegister ? 'Зарегистрироваться через Google' : 'Войти через Google'}
        </button>
      </div>
    </div>
  );
}
