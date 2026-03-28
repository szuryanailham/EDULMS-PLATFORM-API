import pool from '../../db.js';
import { UserEntity } from '../entities/UserEntity.js';

export class UserRepository {
  // find user by username or email
  async findByUsernameOrEmail(username: string, email: string): Promise<UserEntity | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if (result.rows[0]) {
      return new UserEntity(result.rows[0]);
    }
    return null;
  }

  // Create user
  async create(user: UserEntity): Promise<UserEntity> {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, password, created_at, updated_at',
      [user.username, user.email, user.password]
    );
    return new UserEntity(result.rows[0]);
  }
}


