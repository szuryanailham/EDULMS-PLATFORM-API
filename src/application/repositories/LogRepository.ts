import { LogEntity } from '../entities/LogEntity.js';
import { GetLogsQueryDTO } from '../dtos/GetLogsQueryDTO.js';

export class LogRepository {
  readLogs(): LogEntity[] {
    return [];
  }

  filterLogs(logs: LogEntity[], filter: GetLogsQueryDTO) {
    let filtered = logs;
    if (filter.level) filtered = filtered.filter(l => l.level === filter.level);
    if (filter.requestId) filtered = filtered.filter(l => l.requestId === filter.requestId);
    if (filter.actorId) filtered = filtered.filter(l => l.actorId === filter.actorId);
    if (filter.url) filtered = filtered.filter(l => l.url?.startsWith(filter.url!));
    if (filter.method) filtered = filtered.filter(l => l.method === filter.method);
    if (filter.statusCode) filtered = filtered.filter(l => String(l.statusCode) === String(filter.statusCode));
    if (filter.slow !== undefined) filtered = filtered.filter(l => {
      if (filter.slow === 'true' || filter.slow === true) return !!l.slow === true;
      if (filter.slow === 'false' || filter.slow === false) return !!l.slow === false;
      return true;
    });
    return filtered;
  }
}
