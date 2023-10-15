import { LogFormatterType } from "./types/log-formatter.type";
import { LogLevelsEnum } from "./enums/log-levels.enum";
import moment from 'moment';
import { SingletonAlreadyInstantiated } from "@/errors/singleton-errors";

export class LogSystem {
  private static _instance: LogSystem;

  public static get instance() {
    if (!LogSystem._instance) {
      LogSystem._instance = new LogSystem();
    }
    return LogSystem._instance;
  }

  constructor() {
    if (LogSystem._instance != null) {
      throw new SingletonAlreadyInstantiated("A log system instance already exists");
    }

    // Always initialize to our default formatter
    this.defaultFormatter = this._defaultFormatter;

    // Initialize our default log levels
    this.addLogLevel("system", LogLevelsEnum.system);
    this.addLogLevel("debug", LogLevelsEnum.debug);
    this.addLogLevel("info", LogLevelsEnum.info);
    this.addLogLevel("warn", LogLevelsEnum.warn);
    this.addLogLevel("error", LogLevelsEnum.error);
  }

  /**
   * 
   */
  protected logLevels: {[levelName: string]: number} = {};

  /**
   * Used to control what level of logs are displayed
   */
  protected logLevel: number = LogLevelsEnum.info;

  /**
   * Set the logging level
   * @param level The logging level to set to
   */
  public setLogLevel(level: number): void {
    this.logLevel = level;
  }

  /**
   * Add a log level mapping
   * @param levelName The level name
   * @param levelValue The level value (used to determine which messages are shown)
   */
  public addLogLevel(levelName: string, levelValue: number): void {
    this.logLevels[levelName] = levelValue;
  }

  /**
   * The current default formatter to be used for logs
   */
  protected defaultFormatter: LogFormatterType;

  /**
   * Used to set the default formatter, in the event you want to change how all logs
   * are being displayed
   * @param formatter The LogFormatterType function to set as default
   */
  public setDefaultFormatter(formatter: LogFormatterType): void {
    this.defaultFormatter = formatter;
  }

  /**
   * 
   * @param message 
   * @param channel 
   * @returns 
   */
  private _defaultFormatter(channel: string, message: string): string {
    return `[${channel.toUpperCase()}] [${moment(new Date()).format("LTS")}] ${message}`;
  }

  /**
   * 
   * @param channel 
   * @param message 
   * @param formatter 
   */
  public logMessage(channel: string, message: string, formatter?: LogFormatterType): void {
    const isVisible = this.isChannelVisible(channel);
    let returnVal = "";
    if (isVisible && !!formatter) {
      returnVal = formatter(channel, message);
    } else if (isVisible && (formatter == null)) {
      returnVal = this.defaultFormatter(channel, message);
    }
    this.displayMessage(channel, returnVal);
  }

  /**
   * Handle actually displaying the message
   * @param channel 
   * @param message 
   * @returns 
   */
  public displayMessage(channel: string, message: string): void {
    switch (channel) {
      case "warn":
        console.warn(message);
        return;
      case "error":
        console.error(message);
        return;
      default:
        console.log(message);
        return;
    }
  }

  public isChannelVisible(channel: string): boolean {
    const level = this.logLevels[channel] ?? LogLevelsEnum.error;
    return level >= this.logLevel;
  }

  public system(message: string): void {
    this.logMessage("system", message);
  }

  public debug(message: string): void {
    this.logMessage("debug", message);
  }

  public info(message: string): void {
    this.logMessage("info", message);
  }

  public warn(message: string): void {
    this.logMessage("warn", message);
  }

  public error(message: string): void {
    this.logMessage("error", message);
  }
}