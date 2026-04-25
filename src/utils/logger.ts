import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format((info) => {
      if (info.level === 'error' && info.message && typeof info === 'object') {
        const { message, ...data } = info;
        return { ...data, message };
      }
      return info;
    })(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

export default logger;
