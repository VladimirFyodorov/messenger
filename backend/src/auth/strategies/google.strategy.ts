import { Strategy } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

export interface GoogleProfile {
  googleId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('auth.google.clientID') ?? '',
      clientSecret: configService.get<string>('auth.google.clientSecret') ?? '',
      callbackURL: configService.get<string>('auth.google.callbackURL') ?? 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: { id?: string; emails?: { value: string }[]; name?: { givenName?: string; familyName?: string }; photos?: { value: string }[] },
  ): Promise<GoogleProfile> {
    const email = profile.emails?.[0]?.value ?? '';
    const name = profile.name ?? {};
    return {
      googleId: profile.id ?? '',
      email,
      firstName: name.givenName ?? null,
      lastName: name.familyName ?? null,
      avatarUrl: profile.photos?.[0]?.value ?? null,
    };
  }
}
