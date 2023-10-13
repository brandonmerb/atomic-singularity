export interface DefaultLoggableInterface {
  isChannelVisible(channel: string): boolean;

  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}