import { ArrowConstructor, AtomicNebulaInterface, DefaultNebula, ExecutorFunction } from "@/index";
import { AtomicSingularitySystem } from "../atomic-singularity.system";
import { AtomicSingularitySystemOptionsInterface } from "../interfaces/atomic-singularity-system-options.interface";

/**
 * A helper to build modules in a nicer looking fashion
 */
export class NebulaBuilder<ModuleType extends AtomicNebulaInterface = AtomicNebulaInterface> {
  preactivations: Array<ExecutorFunction> = []

  constructor(public module: ModuleType) {
  }

  addPreactivation(...funcs: Array<ExecutorFunction>): this {
    this.preactivations = this.preactivations.concat(funcs)
    return this;
  }

  build(): ArrowConstructor {
    return () => {
      this.preactivations.forEach((func) => {
        func(AtomicSingularitySystem.instance, this.module)
      });
      return this.module;
    }
  }
}

/**
 * Create a new module with specified options. This helper function generates
 * the middleware function expected for Atomic Singularity modules. Additionally
 * you can attach preactivation functions to it to be executed before the module
 * is actually activated. General usage looks like: createNebula({name: "test"})
 * .addPreactivation(() => {console.log("dosomething")}).build()
 * @param options Options to provide for the corresponding ModuleType
 * @returns A MiddlewareUseFunction to activate the module
 */
export function createNebula<ModuleType extends AtomicNebulaInterface = AtomicNebulaInterface>(options: ModuleType): NebulaBuilder {
  return new NebulaBuilder(options);
}

/**
 * Helper function to instantiate a new AtomicSingularitySystem instance.
 * This doesn't do much other than provide slightly nicer syntax
 * @param options AtomicSingularitySystem options
 * @returns An instance of the AtomicSingularitySystem
 */
export function useAtomicApi(options?: AtomicSingularitySystemOptionsInterface): AtomicSingularitySystem {
  const ss = new AtomicSingularitySystem(options);
  if (ss.config.useDefaultNebula === true) {
    ss.use(DefaultNebula);
  }
  return ss;
}