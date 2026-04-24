import prisma from '../../lib/prisma.js';
import { UserEntity } from '../entities/UserEntity.js';

export class UserRepository {
  async findByUsernameOrEmail(username: string, email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
    return user ? new UserEntity(user) : null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const created = await prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
      },
    });
    return new UserEntity(created);
  }
}
