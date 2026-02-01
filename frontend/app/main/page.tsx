'use client';

import {
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import { Chat } from '@/components/main/chat';
import { Sidebar } from '@/components/main/sidebar';
import type { Chat as ChatType } from '@/lib/dto/chat.dto';
import { useAutoAuth } from '@/lib/hooks/use-auth';

export default function MainPage() {
  const router = useRouter();
  const { user, isLoading } = useAutoAuth();
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <Sidebar
        selectedChatId={selectedChat?.id ?? null}
        onSelectChat={setSelectedChat}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Chat chat={selectedChat} />
      </div>
    </div>
  );
}
