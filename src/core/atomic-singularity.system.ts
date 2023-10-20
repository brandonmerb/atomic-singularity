import { AbstractBaseNebula } from "./nebulas/abstract-base.nebula";
import { AtomicModuleInterface } from "./interfaces/atomic-module.interface";
import { LoggingMiddleware, LoggerInterface } from "../integrations/logging";
import { AtomicSingularitySystemOptionsInterface } from "./interfaces/atomic-singularity-system-options.interface";
import { MiddlewareUseFunction } from "../types/middleware.types";
import { DefaultNebula } from "./nebulas/default.nebula";

export class AtomicSingularitySystem {
  // Default system options
  private systemOptions: AtomicSingularitySystemOptionsInterface = {
    systemLogger: LoggingMiddleware.instance.getLogger()
  };

  // Initialize the internal logger we use
  private systemLogger: LoggerInterface;

  // Initialize our nebula storage
  private nebula: AbstractBaseNebula = new DefaultNebula(this, "Default Nebula");

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
    } catch (error: any) {
      this.systemLogger.warn("Failed to execute middleware");
      // TODO: Kind of want a way to control this
      // this.systemLogger.error(error);
    }
    return this;
  }

  /**
   * Fetch the current nebula being used. There should never be more than one Nebula
   * at a time.
   * @returns The Nebula instance in use
   */
  public getNebula<NebulaType extends AbstractBaseNebula<ModuleType>, ModuleType extends AtomicModuleInterface = AtomicModuleInterface>(): NebulaType {
    return this.nebula as NebulaType;
  }

  public setNebula<NebulaType extends AbstractBaseNebula<ModuleType>, ModuleType extends AtomicModuleInterface = AtomicModuleInterface>(providedNebula: NebulaType): this {
    this.nebula = providedNebula;
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
    if (this.nebula == null) {
      const msg = "No Nebula instance was loaded. Check that your useNebula declaration comes before adding a module";
      this.systemLogger.error(msg)
      new Error(msg);
    }

    this.nebula.start();
  }
}