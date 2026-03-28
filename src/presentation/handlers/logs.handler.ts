import type { Request, Response } from 'express';
import { getLogsController } from '../controllers/logsController.js';
import { GetLogsQueryDTO } from '../../application/dtos/GetLogsQueryDTO.js';

export function getLogsHandler(req: Request, res: Response) {
  // Map query params to DTO explicitly
  const dto = new GetLogsQueryDTO({
    level: typeof req.query.level === 'string' ? req.query.level : undefined,
    limit: typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined,
    offset: typeof req.query.offset === 'string' ? Number(req.query.offset) : undefined,
    requestId: typeof req.query.requestId === 'string' ? req.query.requestId : undefined,
    actorId: typeof req.query.actorId === 'string' ? req.query.actorId : undefined,
    url: typeof req.query.url === 'string' ? req.query.url : undefined,
    method: typeof req.query.method === 'string' ? req.query.method : undefined,
    statusCode: typeof req.query.statusCode === 'string' ? req.query.statusCode : undefined,
    slow: typeof req.query.slow === 'string' ? req.query.slow : undefined,
  });

  try {
    const result = getLogsController(dto);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'LogReadError', message: err.message });
  }
}
