import { env } from '../config/env.config';
import { apiClient } from '../api/client';
import { useUpdateProfile } from './use-profile';

export function useUploadAvatar() {
  const updateProfile = useUpdateProfile();

  return {
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const data = (await apiClient.post('files/upload', { body: formData }).json()) as {
        id: string;
      };
      const avatarUrl = `${env.accountBackendUrl}/files/${data.id}/download`;
      await updateProfile.mutateAsync({ avatarUrl });
    },
    isPending: updateProfile.isPending,
  };
}
