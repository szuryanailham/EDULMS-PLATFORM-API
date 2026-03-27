import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logsDir = path.resolve('logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format((info) => {
      // Pisahkan message dari data jika info.error, jaga field "message" agar selalu dipisah
      if (info.level === 'error' && info.message && typeof info === 'object') {
        const { message, ...data } = info;
        return { ...data, message };
      }
      return info;
    })(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logsDir, 'app.log'), maxsize: 5242880, maxFiles: 5 })
  ]
});

export default logger;
