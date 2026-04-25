import prisma from '../../lib/prisma.js';
import { UserEntity } from '../entities/UserEntity.js';

export class UserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? new UserEntity(user) : null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const created = await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      },
    });
    return new UserEntity(created);
  }
}
