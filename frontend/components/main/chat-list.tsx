'use client';

import type {
  Chat,
  UserRef,
} from '@/lib/dto/chat.dto';
import { useAutoAuth } from '@/lib/hooks/use-auth';
import {
  useChats,
  useSearchChats,
} from '@/lib/hooks/use-chats';

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

function getUserDisplayName(u: UserRef): string {
  const name = [u.firstName, u.lastName].filter(Boolean).join(' ');
  return name || u.email;
}

function getUserInitials(u: UserRef): string {
  if (u.firstName || u.lastName) {
    return [u.firstName, u.lastName].filter(Boolean).map((s) => s?.[0]).join('').toUpperCase() || '?';
  }
  return u.email?.[0]?.toUpperCase() ?? '?';
}

interface ChatListProps {
  selectedChatId: string | null;
  onSelectChat: (chat: Chat) => void;
  onSelectUser?: (user: UserRef) => void;
  searchQuery?: string;
  searchResult?: ReturnType<typeof useSearchChats>;
}

export function ChatList({
  selectedChatId,
  onSelectChat,
  onSelectUser,
  searchQuery,
  searchResult,
}: ChatListProps) {
  const { user } = useAutoAuth();
  const { data: allChats = [], isLoading } = useChats();
  const isSearchMode = !!searchQuery?.trim();
  const { data: searchData, isLoading: searchLoading } = searchResult ?? { data: undefined, isLoading: false };

  const chats = isSearchMode ? (searchData?.chats ?? []) : allChats;
  const users = isSearchMode ? (searchData?.users ?? []) : [];
  const loading = isSearchMode ? searchLoading : isLoading;

  if (loading && chats.length === 0 && users.length === 0) {
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
                className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors ${
                  isSelected
                    ? 'border-l-2 border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30'
                    : 'border-l-2 border-transparent bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
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
        {isSearchMode && users.length > 0 && (
          <>
            <li className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Пользователи</li>
            {users.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => onSelectUser?.(u)}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                        {getUserInitials(u)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {getUserDisplayName(u)}
                    </div>
                    <div className="truncate text-xs text-gray-500 dark:text-gray-400">{u.email}</div>
                  </div>
                </button>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
}
