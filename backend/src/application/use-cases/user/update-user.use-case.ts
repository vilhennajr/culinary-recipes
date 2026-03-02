import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/repositories/user.repository';

export interface UpdateUserCommand {
  id: string;
  name?: string | null;
  password?: string;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepository.findById(command.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (command.name !== undefined) {
      user.updateName(command.name ?? null);
    }

    if (command.password) {
      const hashedPassword = await bcrypt.hash(command.password, 10);
      user.updatePassword(hashedPassword);
    }

    return this.userRepository.update(user);
  }
}
