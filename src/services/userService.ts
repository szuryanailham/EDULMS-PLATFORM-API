import pool from '../db'; // (If you get errors during ESM, try '../db.js' or '../db.ts')
import bcrypt from 'bcryptjs';

export async function findUserByUsernameOrEmail(username: string, email: string) {
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1 OR email = $2',
    [username, email]
  );
  return result.rows[0];
}

export async function createUser(username: string, email: string, password: string) {
  const passwordHash = await hashPassword(password);
  const result = await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at, updated_at',
    [username, email, passwordHash]
  );
  return result.rows[0];
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
