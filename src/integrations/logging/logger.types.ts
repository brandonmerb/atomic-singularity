import { LoggerInterface } from "./interfaces/logger.interface";

export type GetLoggerFunction<LoggerType extends LoggerInterface = LoggerInterface> = (...args: any[]) => LoggerType