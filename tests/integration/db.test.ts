import { PostgreSqlContainer } from '@testcontainers/postgresql';
import pkg from 'pg';
const { Client } = pkg;

// Use postgres:15 as recommended for compatibility
const POSTGRES_IMAGE = 'postgres:15';

describe('Testcontainers PostgreSQL', () => {
  let container: any;
  let client: any;

  beforeAll(async () => {
    container = await new PostgreSqlContainer(POSTGRES_IMAGE)
      .withDatabase('testdb')
      .withUsername('testuser')
      .withPassword('testpass')
      .start();
    client = new Client({
      host: container.getHost(),
      port: container.getPort(),
      database: container.getDatabase(),
      user: container.getUsername(),
      password: container.getPassword(),
    });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
    await container.stop();
  });

  it('should be able to query the database', async () => {
    const result = await client.query('SELECT 1 as result');
    expect(result.rows[0].result).toBe(1);
  });
});
