import { ArrowConstructor, AtomicNebulaInterface, DefaultNebula, ExecutorFunction, LifeCycle } from "@/index";
import { AtomicSingularitySystem } from "../atomic-singularity.system";
import { AtomicSingularitySystemOptionsInterface } from "../interfaces/atomic-singularity-system-options.interface";
import { AnyNebulaType } from "@/types/generic.types";
import { takeUntil, filter } from "rxjs";

export type ModuleTypeWithConfiguration<ModuleType extends AtomicNebulaInterface = AtomicNebulaInterface> = ModuleType extends AtomicNebulaInterface<infer Config> ? Config : {};

/**
 * A helper to build modules in a nicer looking fashion
 */
export class NebulaBuilder<ModuleType extends AtomicNebulaInterface = AtomicNebulaInterface, ConfigurationType = ModuleTypeWithConfiguration<ModuleType>> {
  preactivations: Array<ExecutorFunction> = []

  constructor(public module: ModuleType) {
    if (module.configurationSettings) {
      const singularityInstance = AtomicSingularitySystem.instance;
      singularityInstance.afterModuleActivationSubject
        .pipe(
          takeUntil(singularityInstance.onLifeCycle.pipe(filter((cycle) => cycle !== LifeCycle.BeforeStart)))
        )
        .subscribe(async (module) => {await this.registerConfigurations()});
    }
  }

  private async registerConfigurations() {
    if (this.module.configurationSettings) {
      for (let configDefault of this.module.configurationSettings) {
        //configDefault.provider
      }
    }
  }

  addPreactivation(...funcs: Array<ExecutorFunction>): this {
    this.preactivations = this.preactivations.concat(funcs)
    return this;
  }

  set<KeyType extends keyof ConfigurationType, ValueType = ConfigurationType[KeyType]>(key: KeyType, value: ValueType): this {
    // const configProvider = 


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
export function createNebula<ModuleType extends AtomicNebulaInterface = AtomicNebulaInterface>(options: ModuleType): NebulaBuilder<ModuleType> {
  return new NebulaBuilder<ModuleType>(options);
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
