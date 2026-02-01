import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../api/client';
import { UserSchema } from '../dto/auth.dto';
import { useAuthStore } from '../store/auth.store';

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { firstName?: string; lastName?: string; avatarUrl?: string }) => {
      const res = await apiClient.patch('users/me', { json: data }).json<unknown>();
      return UserSchema.parse(res);
    },
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
}
