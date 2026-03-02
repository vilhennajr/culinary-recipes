import { Injectable } from '@nestjs/common';
import { User } from '@domain/entities/user.entity';
import { UserRepository, UserSearchParams } from '@domain/repositories/user.repository';
import { PaginationParams, PaginatedResult } from '@domain/types/pagination';
import { PrismaService } from '../database/prisma.service';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: UserMapper.toCreateInput(user),
    });

    return UserMapper.toDomain(created);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });

    return users.map((u) => UserMapper.toDomain(u));
  }

  async findAllPaginated(
    filters: UserSearchParams,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<User>> {
    const where: Record<string, unknown> = { deletedAt: null };

    if (filters.name) {
      where.name = { contains: filters.name };
    }

    if (filters.login) {
      where.login = { contains: filters.login };
    }

    const orderBy: Record<string, string> = pagination.sortBy
      ? { [pagination.sortBy]: pagination.sortOrder ?? 'asc' }
      : { createdAt: pagination.sortOrder ?? 'asc' };

    const skip = (pagination.page - 1) * pagination.limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({ where, orderBy, skip, take: pagination.limit }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((u) => UserMapper.toDomain(u)),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!user) return null;

    return UserMapper.toDomain(user);
  }

  async findByLogin(login: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { login, deletedAt: null },
    });

    if (!user) return null;

    return UserMapper.toDomain(user);
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id! },
      data: UserMapper.toUpdateInput(user),
    });

    return UserMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const now = new Date();
    await this.prisma.$transaction([
      // Cascade soft-delete all recipes owned by this user
      this.prisma.recipe.updateMany({
        where: { userId: id, deletedAt: null },
        data: { deletedAt: now },
      }),
      // Soft-delete the user
      this.prisma.user.update({
        where: { id },
        data: { deletedAt: now, updatedAt: now },
      }),
    ]);
  }
}
