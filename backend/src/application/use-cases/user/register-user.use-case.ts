import { Inject, Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/repositories/user.repository';

export interface RegisterUserCommand {
  login: string;
  password: string;
  name?: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findByLogin(command.login);
    if (existingUser) {
      throw new ConflictException('User with this login already exists');
    }

    const hashedPassword = await bcrypt.hash(command.password, 10);
    const user = User.create(command.login, hashedPassword, command.name);

    return this.userRepository.create(user);
  }
}
