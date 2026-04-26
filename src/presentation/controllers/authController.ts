import { z } from 'zod';
import { UserRepository } from '../../application/repositories/UserRepository.js';
import { CreateUserRequestDTO } from '../../application/dtos/CreateUserRequestDTO.js';
import { UserResponseDTO } from '../../application/dtos/UserResponseDTO.js';
import { UserEntity } from '../../application/entities/UserEntity.js';
import { signJwt } from '../../utils/jwt.js';
import { hashPassword, comparePassword } from '../../utils/passwordUtils.js';
import { DatabaseError } from '../middlewares/errorHandler.js';
import type { LoginUserRequestDTO } from '../../application/dtos/LoginUserRequestDTO.js';

const signupSchema = z.object({
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  email: z.string().email().max(255),
  password: z.string().min(8).max(255),
});

const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'yahoo.co.id', 'outlook.com',
  'hotmail.com', 'icloud.com', 'live.com', 'protonmail.com',
  'mail.com',
];

const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .max(255)
    .refine((val) => {
      const domain = val.split('@')[1]?.toLowerCase();
      return domain ? ALLOWED_EMAIL_DOMAINS.includes(domain) : false;
    }, 'Email must be from a recognized provider (e.g. gmail.com, yahoo.com)'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(255, 'Password is too long'),
});

const userRepository = new UserRepository();

export async function signupController(createUserDto: CreateUserRequestDTO): Promise<{ user: UserResponseDTO; token: string } | { error: any }> {
  const parse = signupSchema.safeParse(createUserDto);
  if (!parse.success) {
    return { error: parse.error.flatten().fieldErrors };
  }
  const { firstName, lastName, email, password } = parse.data;

  const existing = await userRepository.findByEmail(email);

  if (existing) {
    return { error: { message: 'Email already registered' } };
  }
  const passwordHash = await hashPassword(password);

  const newUserEntity = new UserEntity({ firstName, lastName, email, password: passwordHash });

  let userEntity: UserEntity;
  try {
    userEntity = await userRepository.create(newUserEntity);
  } catch (err) {
    throw new DatabaseError('Failed to create user', err);
  }

  const userDto = new UserResponseDTO({
    id: userEntity.id,
    firstName: userEntity.firstName,
    lastName: userEntity.lastName,
    email: userEntity.email,
    createdAt: userEntity.createdAt,
  });
  const token = signJwt({ id: userEntity.id, email: userEntity.email });
  return { user: userDto, token };
}

export async function loginController(loginUserDto: LoginUserRequestDTO): Promise<{ user: UserResponseDTO; token: string } | { error: any }> {
  const parse = loginSchema.safeParse(loginUserDto);
  if (!parse.success) {
    return { error: parse.error.flatten().fieldErrors };
  }
  const { email, password } = parse.data;
  const userEntity = await userRepository.findByEmail(email);
  if (!userEntity) {
    return { error: { message: 'Invalid email or password' } };
  }
  const passwordMatches = await comparePassword(password, userEntity.password);
  if (!passwordMatches) {
    return { error: { message: 'Invalid email or password' } };
  }
  const userDto = new UserResponseDTO({
    id: userEntity.id,
    firstName: userEntity.firstName,
    lastName: userEntity.lastName,
    email: userEntity.email,
    createdAt: userEntity.createdAt,
  });
  const token = signJwt({ id: userEntity.id, email: userEntity.email });
  return { user: userDto, token };
}
