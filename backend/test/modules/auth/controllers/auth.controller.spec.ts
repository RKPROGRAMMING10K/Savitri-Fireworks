import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../../src/modules/auth/controllers/auth.controller';
import { AuthService } from '../../../../src/modules/auth/services/auth.service';
import { Role } from '../../../../src/common/enums/role.enum';
import { Admin } from '../../../../src/modules/auth/entities/admin.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: any;

  const mockAdmin: Admin = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'admin@savitrifireworks.com',
    password: 'hashedpassword',
    name: 'Super Admin',
    role: Role.ADMIN,
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    normalizeEmail: jest.fn(),
  };

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn().mockResolvedValue({
        accessToken: 'jwt-access-token',
        tokenType: 'Bearer',
        expiresIn: '7d',
        admin: {
          id: mockAdmin.id,
          email: mockAdmin.email,
          name: mockAdmin.name,
          role: mockAdmin.role,
        },
      }),
      getProfile: jest.fn().mockResolvedValue(mockAdmin),
      changePassword: jest.fn().mockResolvedValue({ message: 'Password updated successfully.' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should authenticate admin and return token response', async () => {
      const result = await controller.login({
        email: 'admin@savitrifireworks.com',
        password: 'Savitri@5252',
      });

      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'admin@savitrifireworks.com',
        password: 'Savitri@5252',
      });
      expect(result.data.accessToken).toBe('jwt-access-token');
      expect(result.data.admin.email).toBe('admin@savitrifireworks.com');
    });
  });

  describe('getProfile', () => {
    it('should return the current admin profile', async () => {
      const result = await controller.getProfile(mockAdmin);

      expect(mockAuthService.getProfile).toHaveBeenCalledWith(mockAdmin.id);
      expect(result.data.email).toBe('admin@savitrifireworks.com');
    });
  });

  describe('changePassword', () => {
    it('should call authService.changePassword with admin ID and DTO', async () => {
      const result = await controller.changePassword(mockAdmin.id, {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword123',
      });

      expect(mockAuthService.changePassword).toHaveBeenCalledWith(mockAdmin.id, {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword123',
      });
      expect(result.message).toBe('Password updated successfully.');
    });
  });

  describe('logout', () => {
    it('should return session closed message', async () => {
      const result = await controller.logout();
      expect(result.message).toBe('Administrator session closed successfully.');
    });
  });
});
