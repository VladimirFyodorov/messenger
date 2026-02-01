import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

import { Config } from './types';

export const asyncConfigFactory = (): Config => {
  const configData = {
    app: {
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
      env: process.env.NODE_ENV ?? 'development',
    },
    cors: {
      origin: process.env.FRONTEND_URL ?? 'http://localhost:3001',
    },
    infra: {
      db: {
        host: process.env.DB_HOST ?? 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
        username: process.env.DB_USER ?? 'postgres',
        password: process.env.DB_PASSWORD ?? 'postgres',
        database: process.env.DB_NAME ?? 'messenger',
        synchronize:
          process.env.DB_SYNCHRONIZE !== undefined
            ? process.env.DB_SYNCHRONIZE === 'true'
            : process.env.NODE_ENV !== 'production',
      },
      redis: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
        password: process.env.REDIS_PASSWORD || undefined,
      },
    },
    auth: {
      jwt: {
        secret: process.env.JWT_SECRET ?? 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d',
      },
      google: {
        clientID: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        callbackURL: process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:3000/auth/google/callback',
      },
      oauthSuccessRedirectUrl: process.env.OAUTH_SUCCESS_REDIRECT_URL ?? 'http://localhost:3001',
    },
    files: {
      uploadDir: process.env.UPLOAD_DIR ?? './uploads',
    },
  };

  const config = plainToClass(Config, configData);

  const errors = validateSync(config);

  if (errors.length > 0) {
    throw new Error(JSON.stringify(errors, null, 2));
  }

  return config;
};
