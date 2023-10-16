import { LoggerInterface } from "./interfaces/logger.interface";

export type GetLoggerFunction<LoggerType extends LoggerInterface = any> = () => LoggerType