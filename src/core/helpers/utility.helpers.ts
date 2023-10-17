import { MiddlewareUseFunction } from "@/index";
import { AtomicSingularitySystem } from "../atomic-singularity.system";
import { AtomicModuleInterface } from "../interfaces/atomic-module.interface";
import { AtomicSingularitySystemOptionsInterface } from "../interfaces/atomic-singularity-system-options.interface";

/**
 * Create a new module with specified options. This helper function generates
 * the middleware function expected for Atomic Singularity modules
 * @param options Options to provide for the corresponding ModuleType
 * @returns A MiddlewareUseFunction to activate the module
 */
export function createModule<ModuleType extends AtomicModuleInterface>(options: ModuleType): MiddlewareUseFunction {
  return (app: AtomicSingularitySystem) => {
    try {
      app.getGovernor()
         .activateModule(options);
    } catch {
      console.log(`Activation failed: ${options.name}`);
      return false;
    }
    return true;
  };
}

/**
 * Helper function to instantiate a new AtomicSingularitySystem instance.
 * This doesn't do much other than provide slightly nicer syntax
 * @param options AtomicSingularitySystem options
 * @returns An instance of the AtomicSingularitySystem
 */
export function useAtomicApi(options?: AtomicSingularitySystemOptionsInterface): AtomicSingularitySystem {
  return new AtomicSingularitySystem(options);
}