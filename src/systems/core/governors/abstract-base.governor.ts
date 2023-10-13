import { AtomicModuleInterface } from "../interfaces/atomic-module.interface";

export abstract class AbstractBaseGovernor {
  constructor(
    protected name: string,
    protected side: string,
  ) {}

  /**
   * Register this module for use
   * @param module The module to use
   */
  abstract useModule(module: AtomicModuleInterface): this;
  
  /**
   * Start whatever this system does
   */
  abstract start(): void;
}