'use client';

import type { Chat } from '@/lib/dto/chat.dto';
import { useAutoAuth } from '@/lib/hooks/use-auth';
import { useChats } from '@/lib/hooks/use-chats';

function getChatDisplayName(chat: Chat, currentUserId: string | undefined): string {
  if (chat.name) return chat.name;
  const members = chat.members ?? [];
  const other = members.find((m) => m.user && m.userId !== currentUserId);
  if (!other?.user) return 'Чат';
  return other.user.firstName || other.user.lastName
    ? [other.user.firstName, other.user.lastName].filter(Boolean).join(' ')
    : other.user.email;
}

function getChatAvatarUrl(chat: Chat, currentUserId: string | undefined): string | null {
  if (chat.avatarUrl) return chat.avatarUrl;
  const members = chat.members ?? [];
  const other = members.find((m) => m.user && m.userId !== currentUserId);
  return other?.user?.avatarUrl ?? null;
}

function getChatInitials(chat: Chat, currentUserId: string | undefined): string {
  const name = getChatDisplayName(chat, currentUserId);
  return name.slice(0, 2).toUpperCase() || '?';
}

interface ChatListProps {
  selectedChatId: string | null;
  onSelectChat: (chat: Chat) => void;
}

export function ChatList({ selectedChatId, onSelectChat }: ChatListProps) {
  const { user } = useAutoAuth();
  const { data: chats = [], isLoading } = useChats();

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4 text-gray-500 dark:text-gray-400">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {chats.map((chat) => {
          const name = getChatDisplayName(chat, user?.id);
          const avatarUrl = getChatAvatarUrl(chat, user?.id);
          const initials = getChatInitials(chat, user?.id);
          const isSelected = selectedChatId === chat.id;
          return (
            <li key={chat.id}>
              <button
                type="button"
                onClick={() => onSelectChat(chat)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  isSelected ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`}
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                      {initials}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-gray-900 dark:text-white">{name}</div>
                  <div className="truncate text-xs text-gray-500 dark:text-gray-400">Нет сообщений</div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
