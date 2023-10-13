import { AtomicModuleInterface } from "../../core/interfaces/atomic-module.interface";
import { AbstractLogService } from "./abstract-log.service";
import moment from 'moment';

export class ModuleLogService extends AbstractLogService {
  constructor(public module: AtomicModuleInterface) {
    super();
  }

  public logMessage(channel: string, message: string): void {
    super.logMessage(channel, message, this.moduleFormat)
  }

  public moduleFormat(channel: string, message: string): string {
    return `[${this.module.name}] [${channel.toUpperCase()}] [${moment(new Date()).format("LTS")}] ${message}`;
  }
}