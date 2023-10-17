import { LoggerInterface } from "../interfaces/logger.interface";
import { GetLoggerFunction } from "../logger.types";
import { SingletonAlreadyInstantiated } from "../../../errors/singleton-errors";

/**
 * Super basic Mock Logger. This is only intended to be used in the event that
 * no other loggers are provided to Atomic Singularity to use
 */
export class MockLogger implements LoggerInterface {
  log(channel: string, message: string): this {
    console.log(`[${channel}] ${message}`)
    return this;
  }
  system(message: string): this {
    this.log("SYSTEM", message);
    return this;
  }
  debug(message: string): this {
    this.log("DEBUG", message);
    return this;
  }
  info(message: string): this {
    this.log("INFO", message);
    return this;
  }
  warn(message: string): this {
    this.log("WARN", message);
    return this;
  }
  error(message: string): this {
    this.log("ERROR", message);
    return this;
  }
}

/**
 * Logging Middleware to allow interoperability between multiple
 * logging frameworks without directly requiring them
 */
export class LoggingMiddleware {
  // The fetchFunction that will be used by other modules
  // Note: The default get logger function will discard any arguments given to it
  public getLogger: GetLoggerFunction = (...args: any[]) => this.mockLogger;

  // The MockLogger that will be provided to other modules if
  // no other logger is provided
  private mockLogger: MockLogger;

  // Private property for storing the singleton
  private static _instance: LoggingMiddleware;

  // Public property for accessing the Logging Middleware instance
  public static get instance(): LoggingMiddleware {
    // If there is no instance, instantiate one
    if (this._instance == null) {
      this._instance == new this()
    }
    return this._instance;
  }
  
  /**
   * Instantiate a new instance of LoggingMiddleware. This class is a singleton.
   * There should never be more than one instance.
   * Note: The default get logger function will discard any arguments given to it
   * @param getLoggerFunction The default fetchFunction to be provided to be used for other modules
   */
  constructor(
    getLoggerFunction?: GetLoggerFunction
  ) {
    // Check to make sure this class isn't being instantiated more than once
    if (LoggingMiddleware._instance != null) {
      throw new SingletonAlreadyInstantiated("LoggingMiddleware has already been instantiated");
    }

    // Make sure we update the private property with our instance
    LoggingMiddleware._instance = this;

    // Determine if we need a mock logger
    if (getLoggerFunction != null) {
      // If a getLoggerFunction was provided, then we'll update our fetchFunction
      // to use it
      this.getLogger = getLoggerFunction;
    } else {
      // No getLoggerFunction was provided, so we'll instantiate a mock logger for now
      // that way the default fetchFunction can return a simple logging object
      this.mockLogger = new MockLogger();
    }
  }

  /**
   * Update the Fetch Function that's used by Atomic Design modules through this middleware
   * @param newFunction The function to update the fetchFunction to
   */
  public updateFetchFunction(newFunction: GetLoggerFunction) {
    this.getLogger = newFunction;
  }
}