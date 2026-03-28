import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashes a plain password using bcryptjs.
 */
export async function hashPassword(plainPassword?: string): Promise<string> {
  if (!plainPassword) {
    throw new Error('Password is required');
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainPassword, salt);
}

/**
 * Compares a plain password to a hashed password.
 */
export async function comparePassword(
  plainPassword?: string,
  hash?: string
): Promise<boolean> {
  if (!plainPassword || !hash) {
    throw new Error('Password and hash are required');
  }

  return bcrypt.compare(plainPassword, hash);
}