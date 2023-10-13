import { Constructable } from "../../types/constructable.type";
import { DependencyInjectionSystem } from "../dependency-injection";
import { LogSystem } from "../logging";
import { ModuleLogService } from "../logging/services/module-log.service";
import { AbstractBaseGovernor } from "./governors/abstract-base.governor";
import { AtomicModuleInterface } from "./interfaces/atomic-module.interface";

export class AtomicSingularitySystem {
  // Initialize the internal logger we use
  private systemLogger: ModuleLogService = new ModuleLogService({ name: 'SYSTEM' })

  // Initialize where we're storing all of our modules
  private modules: AtomicModuleInterface[] = [];

  // Initialize our governor storage
  private governor: AbstractBaseGovernor;

  private discoveryType: 'Breadth' | 'Depth' = 'Depth';

  constructor() {
    // Trigger system initialization
    this.initializeSystems();

    this.systemLogger.system("Starting Atomic Singularity System");
  }

  /**
   * Initialize all systems required for AtomicSingularity to work correctly
   */
  private initializeSystems(): void {
    new LogSystem();
    new DependencyInjectionSystem();
  }

  /**
   * Configure the system to use this governor type when our side is set to the side param
   * @param governor An class that inherits from AbstractBaseGovernor
   */
  public useGovernor<GovernorType extends Constructable<AbstractBaseGovernor>>(Governor: GovernorType): AtomicSingularitySystem {
    this.governor = new Governor();
    return this;
  }

  /**
   * Set the search algorithm to discover modules with
   */
  public useDiscoveryType(type: 'Breadth' | 'Depth'): AtomicSingularitySystem {
    this.discoveryType = type;
    return this;
  }

  /**
   * Tell the system to use this module
   * @param module The module to use
   * @returns The AtomicSingularitySystem instance for daisy chaining
   */
  public useModule(module: AtomicModuleInterface): AtomicSingularitySystem {
    this.systemLogger.system(`Adding module: ${module.name} verion ${module.version}`);
    this.modules.push(module);

    if (this.governor == null) {
      const msg = "No Governor instance was loaded. Check that your useGovernor declaration comes before adding a module";
      this.systemLogger.error(msg)
      new Error(msg);
    }

    this.governor.useModule(module);

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

  protected discoverChildren(module: AtomicModuleInterface): AtomicModuleInterface[] {
    if (module.imports && module.imports.length > 0) {
      return module.imports;
    }
    return [];
  }
}