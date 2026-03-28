import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import { errorHandler } from './presentation/middlewares/errorHandler.js';
import { errorLogger } from './presentation/middlewares/loggerMiddleware.js';
import { router as apiRouter } from './presentation/routes/index.js';
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

export default app;
