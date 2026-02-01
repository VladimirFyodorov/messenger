import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../api/client';
import { ChatSchema } from '../dto/chat.dto';

export function useChats() {
  return useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const data = await apiClient.get('chats').json<unknown>();
      const list = Array.isArray(data) ? data : [];
      return list.map((item) => ChatSchema.parse(item));
    },
  });
}
