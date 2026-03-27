import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.resolve('logs', 'app.log');
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export async function getLogsHandler(req: Request, res: Response) {
  let { level, limit, offset, requestId, actorId, url, method, statusCode, slow } = req.query;
  // Parse/validate queries
  const parsedLimit = Math.min(Number(limit) || DEFAULT_LIMIT, MAX_LIMIT);
  const parsedOffset = Number(offset) || 0;

  // Read log file
  try {
    const content = fs.readFileSync(LOG_FILE, 'utf8');
    const lines = content.split('\n').filter(Boolean);
    let logs = lines.map(line => {
      try { return JSON.parse(line); } catch { return null; }
    }).filter(Boolean);
    // Filter if params supplied
    if (level) logs = logs.filter((l: any) => l.level === level);
    if (requestId) logs = logs.filter((l: any) => l.requestId === requestId);
    if (actorId) logs = logs.filter((l: any) => l.actorId === actorId);
    if (url) logs = logs.filter((l: any) => l.url?.startsWith(url));
    if (method) logs = logs.filter((l: any) => l.method === method);
    if (statusCode) logs = logs.filter((l: any) => String(l.statusCode) === String(statusCode));
    if (typeof slow !== 'undefined') logs = logs.filter((l: any) => {
      if (slow === 'true' || slow === true) return !!l.slow === true;
      if (slow === 'false' || slow === false) return !!l.slow === false;
      return true;
    });
    // Pagination
    const paged = logs.slice(parsedOffset, parsedOffset + parsedLimit);
    res.json({ logs: paged, count: logs.length, hasMore: parsedOffset + parsedLimit < logs.length });
  } catch (err: any) {
    res.status(500).json({ error: 'LogReadError', message: err.message });
  }
}
