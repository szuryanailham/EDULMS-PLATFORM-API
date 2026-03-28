import request from 'supertest';
import app from '../../src/app.ts';
import pool from '../../src/db';
describe('POST /api/v1/auth/signup', () => {
  const userData = {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'Secure123!'
  };
  beforeAll(async () => {
    // Clean up test user if exists
    await pool.query('DELETE FROM users WHERE username = $1 OR email = $2', [userData.username, userData.email]);
  });
  it('should register a new user and return token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send(userData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user.username).toBe(userData.username);
    expect(res.body.user.email).toBe(userData.email);
  });
  it('should fail if duplicate username/email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send(userData);
    expect(res.status).toBe(403);
    expect(res.body.status).toBe('fail');
  });
  it('should fail validation if fields missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');
  });
});
