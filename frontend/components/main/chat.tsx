'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import TextareaAutosize from 'react-textarea-autosize';

import type {
  Chat as ChatType,
  Message,
} from '@/lib/dto/chat.dto';
import { useAutoAuth } from '@/lib/hooks/use-auth';
import { useMessages } from '@/lib/hooks/use-messages';

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay ? d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', { dateStyle: 'full', timeStyle: 'short' });
}

function MessageBubble({
  message,
  isOwner,
  showSenderName,
}: {
  message: Message;
  isOwner: boolean;
  showSenderName: boolean;
}) {
  const senderName = message.sender
    ? [message.sender.firstName, message.sender.lastName].filter(Boolean).join(' ') || message.sender.email
    : '';

  return (
    <div className={`flex ${isOwner ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-lg px-3 py-2 ${
          isOwner ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'
        }`}
      >
        {showSenderName && <div className="mb-0.5 text-xs font-medium opacity-90">{senderName}</div>}
        <div className="wrap-break-word text-sm">{message.content}</div>
        <time
          className="mt-1 block text-right text-xs opacity-80"
          title={formatFullDate(message.createdAt)}
          dateTime={message.createdAt}
        >
          {formatTime(message.createdAt)}
        </time>
      </div>
    </div>
  );
}

interface ChatProps {
  chat: ChatType | null;
  onClose?: () => void;
}

export function Chat({ chat, onClose }: ChatProps) {
  const { user } = useAutoAuth();
  const { messages, isLoading, sendMessage } = useMessages(chat?.id ?? null);
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const isDirect = chat?.type === 'direct';
  const showSenderName = !isDirect;

  useEffect(() => {
    if (!chat || !onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chat, onClose]);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !chat || sendMessage.isPending) return;
    sendMessage.mutate({ chatId: chat.id, content: text });
    setDraft('');
  };

  if (!chat) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 p-8 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
        Выберите чат
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-gray-50 dark:bg-gray-900">
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8 text-gray-500">Загрузка...</div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center py-8 text-gray-500 dark:text-gray-400">Нет сообщений</div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwner={msg.senderId === user?.id}
              showSenderName={showSenderName}
            />
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-end gap-2">
          <TextareaAutosize
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a message..."
            minRows={1}
            maxRows={6}
            className="min-h-[40px] w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!draft.trim() || sendMessage.isPending}
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Отправить
          </button>
        </div>
      </form>
    </div>
  );
}
