import type { AtomicModuleInterface } from "../interfaces/atomic-module.interface";

export abstract class AbstractBaseGovernor<ModuleType = AtomicModuleInterface> {
  constructor(
    protected name: string,
    protected side: string,
  ) {}

  /**
   * Register this module for use
   * @param module The module to use
   */
  abstract useModule(module: ModuleType): this;
  
  /**
   * Start whatever this system does
   */
  abstract start(): void;
}