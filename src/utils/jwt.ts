import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'INSECURE_DEFAULT';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
