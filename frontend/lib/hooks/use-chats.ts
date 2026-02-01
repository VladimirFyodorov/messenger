import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { apiClient } from '../api/client';
import {
  type Chat,
  ChatSchema,
  type UserRef,
  UserRefSchema,
} from '../dto/chat.dto';

export interface CreateChatInput {
  type: 'direct' | 'group';
  memberIds: string[];
  name?: string;
}

export function useCreateChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateChatInput): Promise<Chat> => {
      const data = await apiClient
        .post('chats', { json: input })
        .json<unknown>();
      return ChatSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}

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

export interface SearchChatsResult {
  chats: Chat[];
  users: UserRef[];
}

export function useSearchChats(query: string) {
  return useQuery({
    queryKey: ['chats', 'search', query],
    queryFn: async (): Promise<SearchChatsResult> => {
      const data = (await apiClient.get('chats/search', { searchParams: { q: query } }).json()) as {
        chats?: unknown[];
        users?: unknown[];
      };
      const chats = (data.chats ?? []).map((item) => ChatSchema.parse(item));
      const users = (data.users ?? []).map((item) => UserRefSchema.parse(item));
      return { chats, users };
    },
    enabled: !!query?.trim(),
  });
}
