export interface ILogService {
  info(value: any, ...opt: any[]): void;
  log(value: any, ...opt: any[]): void;
  warn(value: any, ...opt: any[]): void;
  error(value: any, ...opt: any[]): void;
}
