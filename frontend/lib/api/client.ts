import ky from 'ky';

import { env } from '../config/env.config';
import {
  getAccessToken,
  getRefreshToken,
  getSessionToken,
} from '../store/auth.store';

export const apiClient = ky.create({
  prefixUrl: env.accountBackendUrl,
  credentials: 'include',
  retry: 0,
  hooks: {
    beforeRequest: [
      (request) => {
        const sessionToken = getSessionToken();
        if (sessionToken) {
          request.headers.set('x-device-session-token', sessionToken);
        }

        const accessToken = getAccessToken();
        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        if (response.status === 401 || response.status === 403) {
          // TODO remove eslint-disable after adding error handling
          // eslint-disable-next-line no-console
          console.log('resJson', await response.clone().json());
          const refreshToken = getRefreshToken();

          if (refreshToken) {
            console.log('[API Client] Refreshing token');
          //   const { accessToken: newAccessToken } = await apiClient
          //     .post<{
          //       message: string;
          //       accessToken: string;
          //     }>('auth/refresh', {
          //       json: {
          //         refreshToken,
          //       },
          //     })
          //     .json();

          //   setAccessToken(newAccessToken);

          //   return apiClient(request);
          }
        }

        return response;
      },
    ],
  },
});
