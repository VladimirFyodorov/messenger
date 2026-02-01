'use client';

import {
  useRef,
  useState,
} from 'react';

import { ChatList } from '@/components/main/chat-list';
import type {
  Chat,
  UserRef,
} from '@/lib/dto/chat.dto';
import {
  useAutoAuth,
  useDeleteAccount,
  useLogout,
} from '@/lib/hooks/use-auth';
import { useSearchChats } from '@/lib/hooks/use-chats';
import { useUploadAvatar } from '@/lib/hooks/use-upload-avatar';

function getInitials(firstName?: string | null, lastName?: string | null, email?: string) {
  if (firstName || lastName) {
    return [firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() || (email?.[0]?.toUpperCase() ?? '?');
  }
  return email?.[0]?.toUpperCase() ?? '?';
}

function getAvatarSrc(avatarUrl?: string | null) {
  if (!avatarUrl) return null;
  return avatarUrl.startsWith('http') ? avatarUrl : avatarUrl;
}

interface SidebarProps {
  selectedChatId: string | null;
  onSelectChat: (chat: Chat) => void;
  onSelectUser?: (user: UserRef) => void;
}

export function Sidebar({ selectedChatId, onSelectChat, onSelectUser }: SidebarProps) {
  const { user } = useAutoAuth();
  const logout = useLogout();
  const deleteAccount = useDeleteAccount();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchResult = useSearchChats(searchQuery);

  if (!user) return null;

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
  const initials = getInitials(user.firstName, user.lastName, user.email);
  const avatarSrc = getAvatarSrc(user.avatarUrl);

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith('image/')) uploadAvatar.upload(file);
    e.target.value = '';
  };

  return (
    <aside className="flex w-80 shrink-0 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex shrink-0 items-center gap-3 p-4">
        <div className="group relative shrink-0">
          <button
            type="button"
            onClick={handleAvatarClick}
            className="relative block h-12 w-12 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600"
            aria-label="Сменить фото"
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-lg font-medium text-gray-600 dark:text-gray-300">
                {initials}
              </span>
            )}
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />
        </div>
        <span className="truncate text-sm font-medium text-gray-900 dark:text-white">{displayName}</span>
      </div>
      <div className="shrink-0 px-4 pb-2">
        <input
          type="search"
          placeholder="Поиск чатов и пользователей..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          aria-label="Поиск"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <ChatList
          selectedChatId={selectedChatId}
          onSelectChat={onSelectChat}
          onSelectUser={onSelectUser}
          searchQuery={searchQuery}
          searchResult={searchQuery.trim() ? searchResult : undefined}
        />
      </div>
      <div className="shrink-0 space-y-2 p-4">
        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          {logout.isPending ? 'Выход...' : 'Выйти'}
        </button>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.confirm('Удалить аккаунт безвозвратно?')) {
              deleteAccount.mutate();
            }
          }}
          disabled={deleteAccount.isPending}
          className="w-full rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-600 dark:bg-gray-700 dark:text-red-300 dark:hover:bg-red-900/20 disabled:opacity-50"
        >
          {deleteAccount.isPending ? 'Удаление...' : 'Удалить аккаунт'}
        </button>
      </div>
    </aside>
  );
}
