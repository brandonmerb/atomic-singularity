export interface LoggerInterface {
  log(channel: string, message: string): this;

  system(message: string): this;
  debug(message: string): this;
  info(message: string): this;
  warn(message: string): this;
  error(message: string): this;
}