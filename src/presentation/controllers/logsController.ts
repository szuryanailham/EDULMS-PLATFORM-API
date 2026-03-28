import { LogRepository } from '../../application/repositories/LogRepository.js';
import { GetLogsQueryDTO } from '../../application/dtos/GetLogsQueryDTO.js';
import { LogResponseDTO } from '../../application/dtos/LogResponseDTO.js';

const logRepository = new LogRepository();
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export function getLogsController(query: GetLogsQueryDTO): LogResponseDTO {
  const parsedLimit = Math.min(Number(query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
  const parsedOffset = Number(query.offset) || 0;
  const allLogs = logRepository.readLogs();
  const filteredLogs = logRepository.filterLogs(allLogs, query);
  const paged = filteredLogs.slice(parsedOffset, parsedOffset + parsedLimit);
  const hasMore = parsedOffset + parsedLimit < filteredLogs.length;
  return new LogResponseDTO({ logs: paged, count: filteredLogs.length, hasMore });
}
