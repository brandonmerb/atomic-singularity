import { AtomicNebulaInterface, LoggingMiddleware, MiddlewareUseFunction } from "@/index";
import { AtomicSingularitySystem } from "../atomic-singularity.system";
import { AtomicSingularitySystemOptionsInterface } from "../interfaces/atomic-singularity-system-options.interface";

/**
 * Create a new module with specified options. This helper function generates
 * the middleware function expected for Atomic Singularity modules
 * @param options Options to provide for the corresponding ModuleType
 * @returns A MiddlewareUseFunction to activate the module
 */
export function createModule<ModuleType extends AtomicNebulaInterface = AtomicNebulaInterface>(options: ModuleType, preActivation?: (app?: AtomicSingularitySystem) => void): MiddlewareUseFunction {
  if (!!preActivation) {
    preActivation(AtomicSingularitySystem.instance);
  }

  // Return a middleware style function that's preconfigured to automatically
  // activate the module within the currently active nebula
  return (app: AtomicSingularitySystem) => {
      // const activeModule = app.getNebula()
      //                         .activateModule(options);

      // // TODO: I probably did something wrong with the type signature generics for the
      // //       as ModuleType part to be necessary
      // return (activeModule as ModuleType) ?? false;

      return options as ModuleType;
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