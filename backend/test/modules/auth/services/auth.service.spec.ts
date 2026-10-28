import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../../../../src/modules/auth/services/auth.service';
import { Admin } from '../../../../src/modules/auth/entities/admin.entity';
import { Role } from '../../../../src/common/enums/role.enum';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let mockAdminRepository: any;
  let mockJwtService: any;

  const mockAdmin: Partial<Admin> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'admin@savitrifireworks.com',
    password: '$2a$10$hashedpasswordstring',
    name: 'Super Admin',
    role: Role.ADMIN,
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockAdminRepository = {
      count: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
      }),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock.jwt.token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Admin),
          useValue: mockAdminRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateAdmin', () => {
    it('should return admin when email and password match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      mockAdminRepository.createQueryBuilder().getOne.mockResolvedValue({
        ...mockAdmin,
      });

      const result = await service.validateAdmin('admin@savitrifireworks.com', 'Savitri@5252');

      expect(result).toBeDefined();
      expect(result?.email).toBe('admin@savitrifireworks.com');
      expect((result as any).password).toBeUndefined();
    });

    it('should return null when password does not match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      mockAdminRepository.createQueryBuilder().getOne.mockResolvedValue({
        ...mockAdmin,
      });

      const result = await service.validateAdmin('admin@savitrifireworks.com', 'WrongPassword');
      expect(result).toBeNull();
    });

    it('should return null when admin does not exist', async () => {
      mockAdminRepository.createQueryBuilder().getOne.mockResolvedValue(null);

      const result = await service.validateAdmin('unknown@savitrifireworks.com', 'somepass');
      expect(result).toBeNull();
    });

    it('should throw UnauthorizedException when admin account is deactivated', async () => {
      mockAdminRepository.createQueryBuilder().getOne.mockResolvedValue({
        ...mockAdmin,
        isActive: false,
      });

      await expect(
        service.validateAdmin('admin@savitrifireworks.com', 'Savitri@5252'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return token and admin profile on valid credentials', async () => {
      jest.spyOn(service, 'validateAdmin').mockResolvedValue(mockAdmin as Admin);

      const result = await service.login({
        email: 'admin@savitrifireworks.com',
        password: 'Savitri@5252',
      });

      expect(result.accessToken).toBe('mock.jwt.token');
      expect(result.tokenType).toBe('Bearer');
      expect(result.admin.email).toBe('admin@savitrifireworks.com');
      expect(result.admin.role).toBe(Role.ADMIN);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      jest.spyOn(service, 'validateAdmin').mockResolvedValue(null);

      await expect(
        service.login({
          email: 'admin@savitrifireworks.com',
          password: 'BadPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('changePassword', () => {
    it('should successfully update password if current password is valid', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2a$10$newhashedpassword');

      mockAdminRepository.createQueryBuilder().getOne.mockResolvedValue({
        ...mockAdmin,
      });

      const result = await service.changePassword('123', {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword123',
      });

      expect(result.message).toBe('Password updated successfully.');
      expect(mockAdminRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if current password is wrong', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      mockAdminRepository.createQueryBuilder().getOne.mockResolvedValue({
        ...mockAdmin,
      });

      await expect(
        service.changePassword('123', {
          currentPassword: 'WrongPassword',
          newPassword: 'NewPassword123',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if new password is same as current password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      mockAdminRepository.createQueryBuilder().getOne.mockResolvedValue({
        ...mockAdmin,
      });

      await expect(
        service.changePassword('123', {
          currentPassword: 'SamePassword123',
          newPassword: 'SamePassword123',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
