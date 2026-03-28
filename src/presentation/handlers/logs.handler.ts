import type { Request, Response } from 'express';
import { getLogsController } from '../controllers/logsController.js';
import { GetLogsQueryDTO } from '../../application/dtos/GetLogsQueryDTO.js';

export function getLogsHandler(req: Request, res: Response) {
  const dto = new GetLogsQueryDTO({
    ...(typeof req.query.level === 'string' && { level: req.query.level }),
    ...(typeof req.query.limit === 'string' && { limit: Number(req.query.limit) }),
    ...(typeof req.query.offset === 'string' && { offset: Number(req.query.offset) }),
    ...(typeof req.query.requestId === 'string' && { requestId: req.query.requestId }),
    ...(typeof req.query.actorId === 'string' && { actorId: req.query.actorId }),
    ...(typeof req.query.url === 'string' && { url: req.query.url }),
    ...(typeof req.query.method === 'string' && { method: req.query.method }),
    ...(typeof req.query.statusCode === 'string' && { statusCode: req.query.statusCode }),
    ...(typeof req.query.slow === 'string' && { slow: req.query.slow }),
  });

  try {
    const result = getLogsController(dto);
    res.json({
      success: true,
      message: 'Logs fetched',
      data: result
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'LogReadError',
      data: null
    });
  }
}