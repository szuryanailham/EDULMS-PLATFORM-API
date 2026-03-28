import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../../application/repositories/UserRepository.js';
import { CreateUserRequestDTO } from '../../application/dtos/CreateUserRequestDTO.js';
import { UserResponseDTO } from '../../application/dtos/UserResponseDTO.js';
import { UserEntity } from '../../application/entities/UserEntity.js';
import { signJwt } from '../../utils/jwt.js';
import type { LoginUserRequestDTO } from '../../application/dtos/LoginUserRequestDTO.js';

const signupSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().max(100),
  password: z.string().min(8),
});

const userRepository = new UserRepository();

export async function signupController(createUserDto: CreateUserRequestDTO): Promise<{ user: UserResponseDTO, token: string } | { error: any }> {
  const parse = signupSchema.safeParse(createUserDto);
  if (!parse.success) {
    return { error: parse.error.flatten().fieldErrors };
  }
  const { username, email, password } = parse.data;
  const existing = await userRepository.findByUsernameOrEmail(username, email);
  if (existing) {
    return { error: { message: 'Username or email already registered' } };
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUserEntity = new UserEntity({ username, email, password: passwordHash });
  const userEntity = await userRepository.create(newUserEntity);
  const userDto = new UserResponseDTO({
    id: userEntity.id,
    username: userEntity.username,
    email: userEntity.email,
    created_at: userEntity.created_at,
  });
  const token = signJwt({ id: userEntity.id, username: userEntity.username });
  return { user: userDto, token };
}

export async function loginController(loginUserDto: LoginUserRequestDTO): Promise<{ user: UserResponseDTO, token: string } | { error: any }> {
  const { email, password } = loginUserDto;
  const userEntity = await userRepository.findByUsernameOrEmail(email, email);
  if (!userEntity) {
    return { error: { message: 'Invalid email or password' } };
  }
  const passwordMatches = await bcrypt.compare(password, userEntity.password);
  if (!passwordMatches) {
    return { error: { message: 'Invalid email or password' } };
  }
  const userDto = new UserResponseDTO({
    id: userEntity.id,
    username: userEntity.username,
    email: userEntity.email,
    created_at: userEntity.created_at,
  });
  const token = signJwt({ id: userEntity.id, username: userEntity.username });
  return { user: userDto, token };
}
 