import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/repositories/user.repository';

export interface LoginUserCommand {
  login: string;
  password: string;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: LoginUserCommand): Promise<User> {
    const user = await this.userRepository.findByLogin(command.login);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(command.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
