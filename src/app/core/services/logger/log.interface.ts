export interface ILogService {
  info(source: string, description: string, value: any): void;
  log(source: string, description: string, value: any): void;
  warn(source: string, description: string, value: any): void;
  error(source: string, description: string, value: any): void;
  table(data: any): void;
}
