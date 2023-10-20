import { MiddlewareUseFunction } from "@/index";
import { ExecutorFunction } from "../../types/executor-functions.types";

/**
 * A Standard Atomic Module. Additional plugins may inherit from this
 * base interface and implement their own features on top of it
 */
export interface AtomicModuleInterface {
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
  imports?: MiddlewareUseFunction<this>[];

  /**
   * Providers to be supplied to any Dependency Injection middleware
   * that's loaded
   */
  providers?: any[];

  /**
   * Executors can be used to hook into different parts of the Atomic Singularity Life cycle
   * to achieve different outcomes. Each Nebula uses these different and may or may not
   * implement hooks for each part of the life cycle
   */
  executors?: {
    /**
     * Module Executors are executed during different parts of the module's life cycle. These
     * are guaranteed to be run by the Atomic Singularity System. Nebulas may also listen for
     * these hooks, but they are not guaranteed to do anything with them.
     */
    module?: {
      /**
       * Fired when this module is being imported, whether by the Atomic Singularity System directly
       * or by another module within the system 
       */
      import?: Array<ExecutorFunction>;

      /**
       * Fired after all modules have been imported, but before the nebulas have begun initializing
       */
      middleware?: Array<ExecutorFunction>;
    },

    /**
     * System Executors are executed during different parts of the system life cycle. Generally
     * these are for things like the backend server starting up. The Atomic Singularity System
     * will not run these by default. These are explicitly executed by relevant Nebulas
     */
    system?: {
      /**
       * These are Nebula implementation specific in the life cycle
       */
      starting?: Array<ExecutorFunction>;

      /**
       * These are Nebula implementation specific in the life cycle
       */
      started?: Array<ExecutorFunction>;

      /**
       * These are Nebula implementation specific in the life cycle
       */
      ending?: Array<ExecutorFunction>;

      /**
       * These are Nebula implementation specific in the life cycle
       */
      ended?: Array<ExecutorFunction>;
    }
  }
}