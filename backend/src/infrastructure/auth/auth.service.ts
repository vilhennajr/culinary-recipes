import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { User } from '@domain/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly revokedTokens = new Set<string>();

  constructor(private readonly jwtService: JwtService) {}

  async generateToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      login: user.login,
      jti: randomUUID(),
    };

    return this.jwtService.sign(payload);
  }

  revokeToken(token: string): void {
    this.revokedTokens.add(token);
  }

  isTokenRevoked(token: string): boolean {
    return this.revokedTokens.has(token);
  }
}
