import { LogEntity } from '../entities/LogEntity.js';
export class LogResponseDTO {
  logs!: LogEntity[];
  count!: number;
  hasMore!: boolean;
  constructor(partial: Partial<LogResponseDTO>) {
    Object.assign(this, partial);
  }
}
