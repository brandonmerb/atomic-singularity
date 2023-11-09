import { DIProviderConfig, DIToken, MiddlewareUseFunction } from "@/index";
import { AsyncActivationFunction, ExecutorFunction } from "../types/executor-functions.types";

/**
 * A Standard Atomic Module. Additional plugins may inherit from this
 * base interface and implement their own features on top of it
 */
export interface AtomicNebulaInterface {
  /**
   * The Module name. This is required to help with distinguishing modules
   */
  name: string;

  /**
   * The Module version. A version is not required. Just recommended for development purposes
   * TODO: Actually make the note below true and work.
   * Note: This field by default is not included in production builds as part of general best security practices
   */
  version?: string;

  /**
   * Whether or not to load this module. This is mostly included for development purposes.
   * Note: If you disable a module, that will prevent all modules imported by this module from
   * being loaded as well
   */
  disabled?: boolean;

  /**
   * Modules to import.
   * Note: If this module is disabled, these will not be loaded
   */
  imports?: MiddlewareUseFunction[];

  /**
   * Providers to be supplied to any Dependency Injection middleware
   * that's loaded
   */
  providers?: Array<DIToken | DIProviderConfig>;

  configure: AsyncActivationFunction | Array<AsyncActivationFunction>;

  onModuleActivation?: AsyncActivationFunction | Array<AsyncActivationFunction>;
  afterModuleActivation?: AsyncActivationFunction | Array<AsyncActivationFunction>;

  onBeforeStart?: ExecutorFunction | Array<ExecutorFunction>;
  onStarted?: ExecutorFunction | Array<ExecutorFunction>;
  onBeforeEnd?: ExecutorFunction | Array<ExecutorFunction>;
  onEnded?: ExecutorFunction | Array<ExecutorFunction>;
}