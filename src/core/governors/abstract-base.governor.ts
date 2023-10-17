import type { ExecutorFunction } from "@/types/executor-functions.types";
import type { OnEnded, OnEnding, OnImport, OnMiddleware, OnStarted, OnStarting } from "../interfaces/atomic-executor.interface";
import type { AtomicModuleInterface } from "../interfaces/atomic-module.interface";
import type { LoggerInterface } from "../../integrations/logging/interfaces/logger.interface";
import { AtomicSingularitySystem } from "../atomic-singularity.system";
import { LoggingMiddleware } from '../../integrations/logging/middleware/logging.middleware'
import { MiddlewareUseFunction } from "@/index";

/**
 * The base class to use when creating Governors. It contains base implementations for many of the required
 * pieces of functionality. You can override pieces as needed.
 */
export abstract class AbstractBaseGovernor<ModuleType extends AtomicModuleInterface = AtomicModuleInterface>
  implements OnImport, OnMiddleware, OnStarting, OnStarted, OnEnding, OnEnded {
  
  // Governor specific data
  protected governorLogger: LoggerInterface;
  protected modules: Array<ModuleType> = [];

  // Executor Queues
  protected onStartingQueue: Array<ExecutorFunction> = [];
  protected onStartedQueue: Array<ExecutorFunction> = [];
  protected onEndingQueue: Array<ExecutorFunction> = [];
  protected onEndedQueue: Array<ExecutorFunction> = [];

  /**
   * Create a new instance of whatever the governor is, with prepopulated tools
   * such as a pre-instantiated logger loaded from our logging middleware
   * @param app A reference to the AtomicSingularitySystem
   * @param name The name of the Governor. Mostly for logging purposes
   * @param logger Optionally a logger to use. If one is not provided, we'll instantiate a new one
   */
  constructor(
    protected app: AtomicSingularitySystem,
    protected name: string,

    logger?: LoggerInterface
  ) {
    // If given a logger, we'll default to that. Otherwise instantiate a new one
    this.governorLogger = logger ?? LoggingMiddleware.instance.getLogger(`Governor: ${name}`);
  }

  /**
   * Hook for adding custom logic to onImport executors
   * @param module The module that owns the onImport executor
   * @param executor The executor being run
   * @returns boolean with success status
   */
  onImport(module: AtomicModuleInterface, executor: ExecutorFunction): boolean {
    return this.runExecutor("onImport", module, executor);
  }

  /**
   * Hook for adding custom logic to onMiddleware executors
   * @param module The module that owns the executor
   * @param executor The executor being run
   * @returns boolean with success status
   */
  onMiddleware(module: AtomicModuleInterface, executor: ExecutorFunction): boolean {
    return this.runExecutor("onMiddleware", module, executor);
  }

  /**
   * Hook for adding custom logic to onStarting executors
   * @param module The module that owns the executor
   * @param executor The executor being run
   * @returns boolean with success status
   */
  onStarting(module: AtomicModuleInterface, executor: ExecutorFunction): boolean {
    return this.runExecutor("onStarting", module, executor);
  }

  /**
   * Hook for adding custom logic to onStarted executors
   * @param module The module that owns the executor
   * @param executor The executor being run
   * @returns boolean with success status
   */
  onStarted(module: AtomicModuleInterface, executor: ExecutorFunction): boolean {
    return this.runExecutor("onStarted", module, executor);
  }

  /**
   * Hook for adding custom logic to onEnding executors
   * @param module The module that owns the executor
   * @param executor The executor being run
   * @returns boolean with success status
   */
  onEnding(module: AtomicModuleInterface, executor: ExecutorFunction): boolean {
    return this.runExecutor("onEnding", module, executor);
  }

  /**
   * Hook for adding custom logic to onEnded executors
   * @param module The module that owns the executor
   * @param executor The executor being run
   * @returns boolean with success status
   */
  onEnded(module: AtomicModuleInterface, executor: ExecutorFunction): boolean {
    return this.runExecutor("onEnded", module, executor);
  }

  /**
   * Generic hook for executing executor functions
   * @param executorType The executor type. This is mainly for logging if it fails
   * @param module The module that owns the executor
   * @param executor The executor
   * @returns 
   */
  protected runExecutor(executorType: string, module: AtomicModuleInterface, executor: ExecutorFunction): boolean {
    try {
      return executor(this.app, module)
    } catch {
      this.governorLogger.error(`${executorType} failed for: ${module.name}`)
      return false;
    }
  }

  /**
   * Activate the module, and trigger importing any submodules this module has
   * Note: Don't use this method as a super call. Doing so will fire the activation
   *       sequences off in the wrong order. Instead override activateGovernorItems,
   *       or activateExecutors as necessary. If that's not sufficient you can override
   *       this method entirely rather than using a super call.
   * @param module The module to activate
   * @returns An instance of the activated module
   */
  public activateModule(module: ModuleType): ModuleType | null {
    if (module.disabled !== true){
      this.governorLogger.system(`Activating module: ${module.name} ${module?.version ?? ""}`);
      this.activateExecutors(module)
            .activateProviders(module)
            .activateGovernorItems(module)
            .activateSubmodules(module);
      return module;
    } else {
      this.governorLogger.system(`Skipping module because it's disabled: ${module.name} ${module?.version ?? ""}`);
    }
    return null
  }

  /**
   * Activate the executors for this module. This will trigger relevant executors, and
   * queue the remaining executors for the appropriate life cycle event
   * @param module The module to activate
   * @returns An instance of this governor for daisy chaining
   */
  protected activateExecutors(module: ModuleType): this {
    // Don't bother with the below steps unless we have the properties
    if (module.executors) {
      if (module.executors.module) {
        // These executors affect everything else, so they're executed immediately
        module.executors.module.import?.forEach((importExecutor) => this.onImport(module, importExecutor));
        module.executors.module.middleware?.forEach((middlewareExecutor) => this.onMiddleware(module, middlewareExecutor));
      }

      if (module.executors.system) {
        // These executors are generally executed later, so just queue them
        this.onStartingQueue.concat(module.executors.system.starting ?? []);
        this.onStartedQueue.concat(module.executors.system.started ?? []);
        this.onEndingQueue.concat(module.executors.system.ending ?? []);
        this.onEndedQueue.concat(module.executors.system.ended ?? []);
      }
    }
    
    return this;
  }

  /**
   * Activate the providers for this module. This will trigger the Dependency Injection
   * middleware to register relevant providers
   * @param module The module to activate
   * @returns An instance of this governor for daisy chaining
   */
  protected activateProviders(module: ModuleType): this {
    return this;
  }

  /**
   * Override this method to provide Governor specific activations without
   * having to rewrite the activateModule method. By default this doesn't do anything
   * @param module The module to activate
   * @returns An instance of this governor for daisy chaining
   */
  protected activateGovernorItems(module: ModuleType): this {
    return this;
  }

  /**
   * Activate all modules, and submodules with the selected search algorithm
   * @param startingPoint 
   * @returns 
   */
  public activateSubmodules(module: ModuleType): this {
    if (this.app.discoveryType === "Breadth") {
      return this.activateSubmodulesBreadthFirst(module?.imports ?? []);
    } else {
      return this.activateSubmodulesDepthFirst(module?.imports ?? []);
    }
  }

  /**
   * Activate all modules in this array in a recursive breadth first fashion
   * Note: Not implemented yet
   * @param startingPoint An array of MiddlewareUseFunctions that hydrate AtomicModules
   * @returns An instance of this governor for daisy chaining
   */
  protected activateSubmodulesBreadthFirst(startingPoint: Array<MiddlewareUseFunction<ModuleType>>): this {
    throw Error("Sorry didn't implement this yet");
    return this;
  }

  /**
   * Activate all modules in this array in a recursive depth first fashion
   * @param startingPoint An array of MiddlewareUseFunctions that hydrate AtomicModules
   * @returns An instance of this governor for daisy chaining
   */
  protected activateSubmodulesDepthFirst(startingPoint: Array<MiddlewareUseFunction<ModuleType>>): this {
    // Loop through each of the submodules and activate it
    startingPoint.forEach((submodule) => {
      // Activating it should cause it to call activateModule itself, causing this behavior
      // to be depth first
      submodule(this.app);
    })

    return this;
  }

  /**
   * Start whatever this system does
   */
  abstract start(): void;
}