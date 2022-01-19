export interface ILogService {
  info(description: string, value: any): void;
  log(description: string, value: any): void;
  warn(description: string, value: any): void;
  error(description: string, value: any): void;
  table(data: any): void;
}
