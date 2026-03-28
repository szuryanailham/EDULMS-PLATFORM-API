export class GetLogsQueryDTO {
  level?: string;
  limit?: number;
  offset?: number;
  requestId?: string;
  actorId?: string;
  url?: string;
  method?: string;
  statusCode?: string;
  slow?: boolean | string;
  constructor(partial?: Partial<GetLogsQueryDTO>) {
    Object.assign(this, partial);
  }
}
