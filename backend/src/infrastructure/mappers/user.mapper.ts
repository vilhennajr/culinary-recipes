import { User } from '@domain/entities/user.entity';
import { User as PrismaUser } from '@prisma/client';
import { Prisma } from '@prisma/client';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return User.reconstitute(
      prismaUser.id,
      prismaUser.name,
      prismaUser.login,
      prismaUser.password,
      prismaUser.createdAt,
      prismaUser.updatedAt,
      prismaUser.deletedAt,
    );
  }

  static toCreateInput(user: User): Prisma.UserCreateInput {
    return {
      id: user.id || undefined,
      name: user.name,
      login: user.login,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toUpdateInput(user: User): Prisma.UserUpdateInput {
    return {
      name: user.name,
      password: user.password,
      updatedAt: user.updatedAt,
    };
  }

  static toDomainList(prismaUsers: PrismaUser[]): User[] {
    return prismaUsers.map((user) => this.toDomain(user));
  }
}
