import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import morgan from 'morgan';
import 'express-async-errors';
import { errorHandler } from './presentation/middlewares/errorHandler.js';
import { errorLogger } from './presentation/middlewares/loggerMiddleware.js';
import { router as apiRouter } from './presentation/routes/index.js';
import { checkDbConnection } from './db.js';
import { requestLogger } from './presentation/middlewares/loggerMiddleware.js';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(requestLogger);


app.use('/api/v1', apiRouter);
app.get('/', (_, res) => res.json({ status: 'ok' }));

app.use(errorLogger);
app.use(errorHandler);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

checkDbConnection();

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

async function shutdown() {
   console.log('Graceful shutdown...');
   server.close(() => {
     console.log('Server closed. Bye!');
     process.exit(0);
   });
 }

export default app;

