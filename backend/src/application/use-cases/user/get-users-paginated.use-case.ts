import { Inject, Injectable } from '@nestjs/common';
import {
  UserRepository,
  UserSearchParams,
  PaginationParams,
  PaginatedResult,
} from '@domain/repositories/user.repository';
import { User } from '@domain/entities/user.entity';

@Injectable()
export class GetUsersPaginatedUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    filters: UserSearchParams,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<User>> {
    return this.userRepository.findAllPaginated(filters, pagination);
  }
}
