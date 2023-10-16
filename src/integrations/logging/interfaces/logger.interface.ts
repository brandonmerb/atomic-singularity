export interface LoggerInterface {
  log(channel: string, message: string): void;

  system(message: string): void;
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}