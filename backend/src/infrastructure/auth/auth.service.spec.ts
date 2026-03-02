import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@domain/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as any;

    authService = new AuthService(jwtService);
  });

  describe('generateToken', () => {
    it('should generate a JWT token with user data', async () => {
      const mockUser = User.reconstitute(
        'user-123',
        'Pedro Alves',
        'pedro.alves@example.com',
        'hashedPassword',
        new Date(),
        new Date(),
      );

      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      jwtService.sign.mockReturnValue(mockToken);

      const result = await authService.generateToken(mockUser);

      expect(result).toBe(mockToken);
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: 'user-123',
          login: 'pedro.alves@example.com',
          jti: expect.any(String),
        }),
      );
    });
  });

  describe('revokeToken / isTokenRevoked', () => {
    it('should add token to revoked list', () => {
      expect(authService.isTokenRevoked('my-token')).toBe(false);

      authService.revokeToken('my-token');

      expect(authService.isTokenRevoked('my-token')).toBe(true);
    });

    it('should not affect other tokens', () => {
      authService.revokeToken('token-a');

      expect(authService.isTokenRevoked('token-b')).toBe(false);
    });
  });
});
