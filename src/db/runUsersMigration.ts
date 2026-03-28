import pool from './db';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export async function runUsersMigration() {
  const sql = fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), './setupUsersTable.sql'), 'utf8');
  await pool.query(sql);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runUsersMigration().then(() => {
    console.log('✅ users table migration run successfully');
    process.exit(0);
  }).catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  });
}
