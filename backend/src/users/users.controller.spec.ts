import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    deleteAccount: jest.fn(),
  };

  const mockRequest = { user: { id: 'user-1' } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteAccount', () => {
    it('should call usersService.deleteAccount with req.user.id', async () => {
      mockUsersService.deleteAccount.mockResolvedValue(undefined);

      await controller.deleteAccount(mockRequest as Parameters<UsersController['deleteAccount']>[0]);

      expect(usersService.deleteAccount).toHaveBeenCalledWith('user-1');
    });
  });
});
