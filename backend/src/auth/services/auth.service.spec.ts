import * as bcrypt from 'bcrypt';

import {
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import { UsersService } from '../../users/users.service';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { TokenService } from './token.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let tokenService: TokenService;
  let sessionService: SessionService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    googleId: null as string | null,
    firstName: null,
    lastName: null,
    avatarUrl: null,
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    findByGoogleId: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    updateGoogleId: jest.fn(),
    updateFromGoogleProfile: jest.fn(),
  };

  const mockTokenService = {
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
  };

  const mockSessionService = {
    createSession: jest.fn(),
    findSessionByToken: jest.fn(),
    revokeSession: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    tokenService = module.get<TokenService>(TokenService);
    sessionService = module.get<SessionService>(SessionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'new@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUsersService.create.mockResolvedValue(mockUser);
      mockTokenService.generateAccessToken.mockResolvedValue('accessToken');
      mockTokenService.generateRefreshToken.mockResolvedValue('refreshToken');
      mockSessionService.createSession.mockResolvedValue({});

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(mockUsersService.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if passwords do not match', async () => {
      const registerDto = {
        email: 'new@example.com',
        password: 'password123',
        confirmPassword: 'different',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockTokenService.generateAccessToken.mockResolvedValue('accessToken');
      mockTokenService.generateRefreshToken.mockResolvedValue('refreshToken');
      mockSessionService.createSession.mockResolvedValue({});

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrong' };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe(mockUser.id);
    });

    it('should return null when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrong');

      expect(result).toBeNull();
    });
  });

  describe('googleAuth', () => {
    const profile = {
      googleId: 'google-123',
      email: 'google@example.com',
      firstName: 'John',
      lastName: 'Doe',
      avatarUrl: 'https://example.com/avatar.png',
    };

    it('should login existing user by googleId and update profile', async () => {
      const existing = { ...mockUser, googleId: 'google-123' };
      mockUsersService.findByGoogleId.mockResolvedValue(existing);
      mockUsersService.updateFromGoogleProfile.mockResolvedValue(existing);
      mockUsersService.findById.mockResolvedValue(existing);
      mockTokenService.generateAccessToken.mockResolvedValue('at');
      mockTokenService.generateRefreshToken.mockResolvedValue('rt');
      mockSessionService.createSession.mockResolvedValue({});

      const result = await service.googleAuth(profile);

      expect(result.accessToken).toBe('at');
      expect(result.refreshToken).toBe('rt');
      expect(mockUsersService.findByGoogleId).toHaveBeenCalledWith('google-123');
      expect(mockUsersService.updateFromGoogleProfile).toHaveBeenCalledWith(
        '1',
        { firstName: 'John', lastName: 'Doe', avatarUrl: 'https://example.com/avatar.png' },
      );
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('should link Google to existing user by email', async () => {
      mockUsersService.findByGoogleId.mockResolvedValue(null);
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.updateGoogleId.mockResolvedValue(mockUser);
      mockUsersService.updateFromGoogleProfile.mockResolvedValue(mockUser);
      mockUsersService.findById.mockResolvedValue(mockUser);
      mockTokenService.generateAccessToken.mockResolvedValue('at');
      mockTokenService.generateRefreshToken.mockResolvedValue('rt');
      mockSessionService.createSession.mockResolvedValue({});

      const result = await service.googleAuth(profile);

      expect(result.accessToken).toBe('at');
      expect(mockUsersService.updateGoogleId).toHaveBeenCalledWith('1', 'google-123');
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('should create new user when no match', async () => {
      const created = { ...mockUser, id: '2', email: profile.email, googleId: profile.googleId };
      mockUsersService.findByGoogleId.mockResolvedValue(null);
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(created);
      mockTokenService.generateAccessToken.mockResolvedValue('at');
      mockTokenService.generateRefreshToken.mockResolvedValue('rt');
      mockSessionService.createSession.mockResolvedValue({});

      const result = await service.googleAuth(profile);

      expect(result.accessToken).toBe('at');
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: profile.email,
        googleId: profile.googleId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatarUrl: profile.avatarUrl,
      });
    });
  });
});
