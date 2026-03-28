import type { Request, Response } from 'express';
import { signupController } from '../controllers/authController.js';
import { CreateUserRequestDTO } from '../../application/dtos/CreateUserRequestDTO.js';

export async function signupHandler(req: Request, res: Response) {
  const createUserDto = new CreateUserRequestDTO(req.body);
  const result = await signupController(createUserDto);

  if ('error' in result) {
    return res.status(400).json({ status: 'fail', errors: result.error });
  }

  res.status(201).json({
    status: 'success',
    user: result.user,
    token: result.token,
  });
}
