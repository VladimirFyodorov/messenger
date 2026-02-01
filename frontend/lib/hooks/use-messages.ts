import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../api/client';
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
    onSuccess: (_, { chatId: cid }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', cid] });
    },
  });

  return { messages: query.data ?? [], isLoading: query.isLoading, sendMessage };
}
