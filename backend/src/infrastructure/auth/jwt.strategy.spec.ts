import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: jest.Mocked<ConfigService>;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    configService = {
      get: jest.fn().mockReturnValue('test-secret'),
    } as any;

    authService = {
      isTokenRevoked: jest.fn().mockReturnValue(false),
    } as any;

    strategy = new JwtStrategy(configService, authService);
  });

  describe('validate', () => {
    const mockReq = {
      headers: { authorization: 'Bearer valid-token' },
    } as any;

    it('should return user data for valid payload', async () => {
      const payload = { sub: 'user-123', login: 'test@example.com' };

      const result = await strategy.validate(mockReq, payload);

      expect(result).toEqual({
        userId: 'user-123',
        login: 'test@example.com',
      });
    });

    it('should throw UnauthorizedException when sub is missing', async () => {
      const payload = { sub: '', login: 'test@example.com' };

      await expect(strategy.validate(mockReq, payload)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when token is revoked', async () => {
      authService.isTokenRevoked.mockReturnValue(true);
      const payload = { sub: 'user-123', login: 'test@example.com' };

      await expect(strategy.validate(mockReq, payload)).rejects.toThrow('Token has been revoked');
    });
  });
});
