export class LogEntity {
  timestamp!: string;
  level!: string;
  message?: string;
  requestId?: string;
  actorId?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  slow?: boolean;
  [key: string]: any; // allow for flexible fields

  constructor(partial: Partial<LogEntity>) {
    Object.assign(this, partial);
  }
}
