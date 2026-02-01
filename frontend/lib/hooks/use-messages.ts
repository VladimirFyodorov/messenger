import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { apiClient } from '../api/client';
import type { Message } from '../dto/chat.dto';
import { MessageSchema } from '../dto/chat.dto';

export function useMessages(chatId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      if (!chatId) return [];
      const data = await apiClient.get(`chats/${chatId}/messages`).json<unknown>();
      const list = Array.isArray(data) ? data : [];
      return list.map((item) => MessageSchema.parse(item)).reverse();
    },
    enabled: !!chatId,
  });

  const sendMessage = useMutation({
    mutationFn: async ({ chatId: cid, content }: { chatId: string; content: string }) => {
      const res = await apiClient
        .post(`chats/${cid}/messages`, { json: { content } })
        .json<unknown>();
      return MessageSchema.parse(res);
    },
    onSuccess: (message: Message, { chatId: cid }) => {
      queryClient.setQueryData<Message[]>(['messages', cid], (prev) => {
        const list = prev ?? [];
        if (list.some((m) => m.id === message.id)) return list;
        return [...list, message];
      });
    },
  });

  return { messages: query.data ?? [], isLoading: query.isLoading, sendMessage };
}
