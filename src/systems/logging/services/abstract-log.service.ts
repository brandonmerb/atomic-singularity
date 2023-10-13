import { DefaultLoggableInterface } from "../interfaces/default-loggable.interface";
import { LogSystem } from "../log.system";
import { LogFormatterType } from "../types/log-formatter.type";

export abstract class AbstractLogService implements DefaultLoggableInterface {
  protected getSystem(): LogSystem {
    return LogSystem.instance;
  }

  /**
 * 
 * @param channel 
 * @param message 
 * @param formatter 
 */
  public logMessage(channel: string, message: string, formatter?: LogFormatterType): void {
    this.getSystem().logMessage(channel, message, formatter);
  }

  public isChannelVisible(channel: string): boolean {
    return this.getSystem().isChannelVisible(channel);
  }

  public system(message: string): void {
    this.getSystem().system(message);
  }

  public debug(message: string): void {
    this.getSystem().debug(message);
  }

  public info(message: string): void {
    this.getSystem().info(message);
  }

  public warn(message: string): void {
    this.getSystem().warn(message);
  }

  public error(message: string): void {
    this.getSystem().error(message);
  }
}