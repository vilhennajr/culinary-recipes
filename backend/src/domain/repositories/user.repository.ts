import { User } from '../entities/user.entity';
export { PaginationParams, PaginatedResult } from '../types/pagination';
import { PaginationParams, PaginatedResult } from '../types/pagination';

export interface UserSearchParams {
  name?: string;
  login?: string;
}

export interface UserRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findAllPaginated(
    filters: UserSearchParams,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<User>>;
  findById(id: string): Promise<User | null>;
  findByLogin(login: string): Promise<User | null>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

export const UserRepository = Symbol('UserRepository');
