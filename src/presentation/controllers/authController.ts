import type { Request, Response } from 'express';
import { z } from 'zod';
import { findUserByUsernameOrEmail, createUser } from '../../services/userService.js';
import { signJwt } from '../../utils/jwt.js';

const signupSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().max(100),
  password: z.string().min(8),
});

export async function signupController(req: Request, res: Response) {
  const parse = signupSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({
      status: 'fail',
      errors: parse.error.flatten().fieldErrors
    });
  }
  const { username, email, password } = parse.data;

  const existing = await findUserByUsernameOrEmail(username, email);
  if (existing) {
    return res.status(403).json({ status: 'fail', message: 'Username or email already registered' });
  }
  const user = await createUser(username, email, password);
  const token = signJwt({ id: user.id, username: user.username });
  
  return res.status(201).json({
    status: 'success',
    user,
    token
  });
}
