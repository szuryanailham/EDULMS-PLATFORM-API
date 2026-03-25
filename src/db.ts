import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

export const checkDbConnection = async (retries = 10, delay = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pool.query('SELECT 1');
      console.log('✅ Success: Connected to PostgreSQL database');
      return;
    } catch (error: any) {
      console.error(`❌ Error: Failed to connect to PostgreSQL database (Attempt ${attempt}/${retries})`, error.message || error);
      if (attempt < retries) {
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error('❌ Exceeded max retries. Could not connect to PostgreSQL database. Shutting down.');
        process.exit(1);
      }
    }
  }
};

export default pool;
