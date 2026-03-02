import { Inject, Injectable } from '@nestjs/common';
import { User } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/repositories/user.repository';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
