import { AbstractBaseGovernor } from "./governors/abstract-base.governor";
import { AtomicModuleInterface } from "./interfaces/atomic-module.interface";
import { LoggingMiddleware, LoggerInterface } from "../integrations/logging";
import { AtomicSingularitySystemOptionsInterface } from "./interfaces/atomic-singularity-system-options.interface";
import { MiddlewareUseFunction } from "../types/middleware.types";

export class AtomicSingularitySystem {
  // Default system options
  private systemOptions: AtomicSingularitySystemOptionsInterface = {
    systemLogger: LoggingMiddleware.instance.getLogger()
  };

  // Initialize the internal logger we use
  private systemLogger: LoggerInterface;

  // Initialize our governor storage
  private governor: AbstractBaseGovernor;

  public discoveryType: 'Breadth' | 'Depth' = 'Depth';

  constructor(
    options?: AtomicSingularitySystemOptionsInterface
  ) {
    // Update system options based on provided options
    this.systemOptions = {
      // User options come first, since spread does not overwrite
      ...options,
      // Defaults come second, since this prevents overwriting
      ...this.systemOptions,
    }
  }

  public use<MiddlewareReturnType = boolean>(middleware: MiddlewareUseFunction<MiddlewareReturnType>): this {
    try {
      middleware(this);
    } catch {
      this.systemLogger.error("Failed to execute middleware");
    }
    return this;
  }

  /**
   * Fetch the current governor being used. There should never be more than one Governor
   * at a time.
   * @returns The Governor instance in use
   */
  public getGovernor<GovernorType extends AbstractBaseGovernor<ModuleType>, ModuleType extends AtomicModuleInterface = AtomicModuleInterface>(): GovernorType {
    return this.governor as GovernorType;
  }

  public setGovernor<GovernorType extends AbstractBaseGovernor<ModuleType>, ModuleType extends AtomicModuleInterface = AtomicModuleInterface>(providedGovernor: GovernorType): this {
    this.governor = providedGovernor;
    return this
  }
  /**
   * Set the search algorithm to discover modules with
   */
  public useDiscoveryType(type: 'Breadth' | 'Depth'): AtomicSingularitySystem {
    this.discoveryType = type;
    return this;
  }

  /**
   * Trigger the system to start
   */
  public start(): void {
    if (this.governor == null) {
      const msg = "No Governor instance was loaded. Check that your useGovernor declaration comes before adding a module";
      this.systemLogger.error(msg)
      new Error(msg);
    }

    this.governor.start();
  }
}