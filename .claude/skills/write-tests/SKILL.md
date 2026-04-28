---
name: write-tests
description: Use this skill when writing tests for this Express/TypeScript budgeting API. Covers unit tests, integration tests, and test structure conventions using Jest.
---

# Write Tests — Express TypeScript (Jest)

This skill guides writing tests for the BUDGETING project: an Express + TypeScript REST API using Jest as the test runner.

## Test Commands

```bash
npm run test                  # run all tests
npm run test:unit             # run unit tests only
npm run test:integration      # run integration tests only
npm run test:watch            # watch mode
npm run test:coverage         # run with coverage report
```

## Directory Structure

```
tests/
├── unit/
│   ├── controllers/
│   ├── repositories/
│   └── utils/
└── integration/
    └── routes/
```

## Test Structure (AAA Pattern)

Always use Arrange-Act-Assert:

```typescript
describe('UserRepository', () => {
  it('returns user by id', async () => {
    // Arrange
    const userId = 1;

    // Act
    const result = await userRepo.findById(userId);

    // Assert
    expect(result).toBeDefined();
    expect(result?.id).toBe(userId);
  });
});
```

## Unit Test — Controller

```typescript
import { Request, Response } from 'express';
import { AuthController } from '../../../src/presentation/controllers/authController';

describe('AuthController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('returns 400 when email is missing', async () => {
    req.body = { password: 'secret' };

    await AuthController.login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
```

## Unit Test — Repository

```typescript
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../../../src/application/repositories/userRepository';

jest.mock('@prisma/client');

describe('UserRepository', () => {
  it('calls prisma findUnique with correct args', async () => {
    const mockFindUnique = jest.fn().mockResolvedValue({ id: 1, email: 'test@gmail.com' });
    (PrismaClient as jest.Mock).mockImplementation(() => ({
      user: { findUnique: mockFindUnique },
    }));

    const repo = new UserRepository();
    await repo.findByEmail('test@gmail.com');

    expect(mockFindUnique).toHaveBeenCalledWith({ where: { email: 'test@gmail.com' } });
  });
});
```

## Integration Test — Route

```typescript
import request from 'supertest';
import app from '../../../src/app';

describe('POST /auth/login', () => {
  it('returns 200 with valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'user@gmail.com', password: 'ValidPass123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('returns 400 when email is not @gmail.com', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'user@yahoo.com', password: 'ValidPass123' });

    expect(res.status).toBe(400);
  });
});
```

## Coverage Requirements

- Minimum **80%** across statements, branches, functions, lines
- Every controller method must have at least one happy-path and one error-path test
- Validation logic (email, password rules) must have boundary tests

## What to Test per Layer

| Layer | Focus |
|-------|-------|
| Controller | HTTP status codes, response shape, input validation |
| Repository | Correct query args, error propagation |
| DTO/Validation | Valid input passes, invalid input rejects with right message |
| Middleware | Auth guard allows/denies correctly |

## TDD Workflow

1. Write the failing test (RED) — `npm run test:unit`
2. Write minimal implementation (GREEN) — make the test pass
3. Refactor (IMPROVE) — clean up without breaking tests
4. Verify coverage — `npm run test:coverage`
