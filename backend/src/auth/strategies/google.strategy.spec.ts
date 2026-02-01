import { GoogleStrategy } from './google.strategy';

describe('GoogleStrategy', () => {
  const origEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...origEnv, GOOGLE_CLIENT_ID: 'id', GOOGLE_CLIENT_SECRET: 'secret', GOOGLE_CALLBACK_URL: 'http://localhost:3000/auth/google/callback' };
  });

  afterEach(() => {
    process.env = origEnv;
  });

  it('should return GoogleProfile from validate', async () => {
    const strategy = new GoogleStrategy();
    const profile = {
      id: 'g-1',
      emails: [{ value: 'u@example.com' }],
      name: { givenName: 'Jane', familyName: 'Doe' },
      photos: [{ value: 'https://photo.url' }],
    };
    const result = await strategy.validate('at', 'rt', profile);
    expect(result).toEqual({
      googleId: 'g-1',
      email: 'u@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      avatarUrl: 'https://photo.url',
    });
  });

  it('should handle missing optional fields', async () => {
    const strategy = new GoogleStrategy();
    const result = await strategy.validate('at', 'rt', { id: 'g-2' });
    expect(result).toEqual({
      googleId: 'g-2',
      email: '',
      firstName: null,
      lastName: null,
      avatarUrl: null,
    });
  });
});
