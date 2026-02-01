'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import ky from 'ky';
import Link from 'next/link';

import { Chat } from '@/components/main/chat';
import { Sidebar } from '@/components/main/sidebar';
import {
  RealtimeSubscriptions,
} from '@/components/providers/realtime-subscriptions';
import { env } from '@/lib/config/env.config';
import { UserSchema } from '@/lib/dto/auth.dto';
import type { Chat as ChatType } from '@/lib/dto/chat.dto';
import { useAutoAuth } from '@/lib/hooks/use-auth';
import { useCreateChat } from '@/lib/hooks/use-chats';
import { RealtimeProvider } from '@/lib/hooks/use-socket';
import { useAuthStore } from '@/lib/store/auth.store';

export default function Home() {
  const { user, isLoading } = useAutoAuth();
  const createChat = useCreateChat();
  const [processingOAuth, setProcessingOAuth] = useState(false);
  const oauthHandled = useRef(false);
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);

  const handleSelectUser = (u: { id: string }) => {
    if (!user) return;
    createChat
      .mutateAsync({ type: 'direct', memberIds: [user.id, u.id] })
      .then(setSelectedChat);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || oauthHandled.current) return;
    const hash = window.location.hash.slice(1);
    const search = window.location.search.slice(1);
    const params = new URLSearchParams(hash || search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (!accessToken || !refreshToken) return;

    oauthHandled.current = true;
    setProcessingOAuth(true);
    const setAuth = useAuthStore.getState().setAuth;

    ky.get('users/me', {
      prefixUrl: env.accountBackendUrl,
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .json()
      .then((data) => {
        const parsedUser = UserSchema.parse(data);
        setAuth(accessToken, refreshToken, parsedUser);
        window.history.replaceState({}, '', window.location.pathname + window.location.search);
      })
      .finally(() => {
        oauthHandled.current = false;
        setProcessingOAuth(false);
      });
  }, []);

  if (isLoading || processingOAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <RealtimeProvider userId={user.id}>
        <RealtimeSubscriptions />
        <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
          <Sidebar
          selectedChatId={selectedChat?.id ?? null}
          onSelectChat={setSelectedChat}
          onSelectUser={handleSelectUser}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Chat chat={selectedChat} onClose={() => setSelectedChat(null)} />
        </div>
      </div>
      </RealtimeProvider>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Messenger
          </h1>
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
        </div>
      </main>
    </div>
  );
}
