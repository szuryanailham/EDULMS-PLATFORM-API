import type { Request, Response } from 'express';
import { loginController, signupController } from '../controllers/authController.js';
import { CreateUserRequestDTO } from '../../application/dtos/CreateUserRequestDTO.js';
import { LoginUserRequestDTO } from '../../application/dtos/LoginUserRequestDTO.js';



export async function signupHandler(req: Request, res: Response) {
  const createUserDto = new CreateUserRequestDTO(req.body);
  const result = await signupController(createUserDto);

  if ('error' in result) {
    return res.status(400).json({
      success: false,
      message: result.error?.message || 'Registration failed',
      data: null
    });
  }

  res.status(201).json({
    success: true,
    message: 'Registration successfully',
    data: {
      user: result.user,
      token: result.token
    }
  });
}


export async function loginHandler(req: Request, res: Response) {
 const loginUserDto = new LoginUserRequestDTO(req.body);
 const result = await loginController(loginUserDto);
 
if ('error' in result) {
   return res.status(400).json({
     success: false,
     message: result.error?.message || 'Login failed',
     data: null
   });
 }
 res.json({
   success: true,
   message: 'Login successfully',
   data: {
     user: result.user,
     token: result.token
   }
 });
}