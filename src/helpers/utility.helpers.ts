import { ArrowConstructor, AtomicNebulaInterface, DefaultNebula, ExecutorFunction } from "@/index";
import { AtomicSingularitySystem } from "../atomic-singularity.system";
import { AtomicSingularitySystemOptionsInterface } from "../interfaces/atomic-singularity-system-options.interface";
import { AnyNebulaType } from "@/types/generic.types";

/**
 * Singleton = Root level only
 * Transient = Unique per nebula
 * Scoped = Inherits configurations from parents, with the nearest descendent taking priority
 */
export type ConfigurationValueScope = "singleton" | "scoped" | "transient";

export class ConfigurationBuilder<NebulaType = AnyNebulaType, ConfigurationType = {}> {
  constructor(public module: NebulaType) {}

  setGlobal<KeyType extends keyof ConfigurationType, ValueType = ConfigurationType[KeyType]>(key: KeyType, value: ValueType): this {

    return this;
  }

  setTransient<KeyType extends keyof ConfigurationType, ValueType = ConfigurationType[KeyType]>(key: KeyType, value: ValueType): this {

    return this;
  }

  setScoped<KeyType extends keyof ConfigurationType, ValueType = ConfigurationType[KeyType]>(key: KeyType, value: ValueType): this {

    return this;
  }

  get<KeyType extends keyof ConfigurationType, ValueType = ConfigurationType[KeyType]>(key: KeyType): ValueType {

  }
}

function useModuleConfiguration<NebulaType = AnyNebulaType, ConfigurationType = {}>(module: NebulaType): ConfigurationBuilder<NebulaType, ConfigurationType> {
  return new ConfigurationBuilder<NebulaType, ConfigurationType>(module);
}

/**
 * A helper to build modules in a nicer looking fashion
 */
export class NebulaBuilder<ModuleType extends AtomicNebulaInterface = AtomicNebulaInterface, ConfigurationType = {}> {
  preactivations: Array<ExecutorFunction> = []

  constructor(public module: ModuleType) {
  }

  addPreactivation(...funcs: Array<ExecutorFunction>): this {
    this.preactivations = this.preactivations.concat(funcs)
    return this;
  }

  addConfigurableOption<KeyType extends keyof ConfigurationType, ValueType = ConfigurationType[KeyType]>(optionName: KeyType, defaultValue?: ValueType, scope?: ConfigurationValueScope): this {
    return this;
  }

  addConfigurable(configuration: ConfigurationType): this {
    return this;
  }

  configure(scope?: ConfigurationValueScope): ConfigurationBuilder {
    return useConfigurationBuilder(this.module);
  }

  // addConfigurations(): this {

  // }

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
export function createNebula<ModuleType extends AtomicNebulaInterface = AtomicNebulaInterface, ConfigurationType = {}>(options: ModuleType): NebulaBuilder<ModuleType, ConfigurationType> {
  return new NebulaBuilder<ModuleType, ConfigurationType>(options);
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
