'use client';

import Link from 'next/link';

import { useAutoAuth } from '@/lib/hooks/use-auth';

function getUserDisplayName(user: { firstName?: string | null; lastName?: string | null; email: string } | null): string {
  if (!user) return '';
  
  if (user.firstName || user.lastName) {
    return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
  }
  
  return user.email;
}

export default function Home() {
  const { user, isLoading } = useAutoAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Загрузка...</p>
        </div>
      </div>
    );
  }

  const displayName = getUserDisplayName(user);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Messenger
          </h1>
          {user ? (
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12">
              Добро Пожаловать, {displayName}!
            </p>
          ) : (
            <>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12">
                Общайтесь быстро и безопасно
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/sign-up"
                  className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Регистрация
                </Link>
                <Link
                  href="/sign-in"
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Вход
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
