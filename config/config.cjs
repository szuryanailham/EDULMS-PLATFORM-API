require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASS || 'admin123',
    database: process.env.DB_NAME || 'edulms',
    host: process.env.DB_HOST || 'db',
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASS || 'admin123',
    database: process.env.DB_NAME || 'edulms',
    host: process.env.DB_HOST || 'db',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASS || 'admin123',
    database: process.env.DB_NAME || 'edulms',
    host: process.env.DB_HOST || 'db',
    dialect: 'postgres',
  }
};
