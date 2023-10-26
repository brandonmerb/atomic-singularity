import { LoggerInterface, LoggerToken } from "..";
import { DependencyInjectionMiddleware } from "../integrations/dependency-injection/dependency-injection.middleware";
import { LoggingMiddleware } from "../integrations/logging/middleware/logging.middleware";

/**
 * Fetch the Logging Middleware. This is a lot easier to type &
 * fits the patterns I want more
 * @returns LoggingMiddleware
 */
export function useLogging(): LoggingMiddleware {
  return LoggingMiddleware.instance;
}

/**
 * Fetch the Dependency Injection Middleware. This is a lot easier to type &
 * fits the patterns I want more
 * @returns LoggingMiddleware
 */
export function useDI(): DependencyInjectionMiddleware {
  return DependencyInjectionMiddleware.instance;
}

export function useLogger(): LoggerInterface {
  return DependencyInjectionMiddleware.instance.inject(LoggerToken);
}

export class ModuleLoggerProvider {
  constructor() {
  }
}