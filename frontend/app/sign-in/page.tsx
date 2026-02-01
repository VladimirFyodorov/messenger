import { AuthForm } from '@/components/auth/auth-form';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Вход
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Войдите в свой аккаунт
          </p>
        </div>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
