import { AtomicSingularitySystem } from "../atomic-singularity.system";
import { AtomicModuleInterface } from "../interfaces/atomic-module.interface";
import { AtomicSingularitySystemOptionsInterface } from "../interfaces/atomic-singularity-system-options.interface";

export function createModule<ModuleType extends AtomicModuleInterface>(options: ModuleType): ModuleType {
  return options;
}

export function useAtomicApi(options?: AtomicSingularitySystemOptionsInterface): AtomicSingularitySystem {
  return new AtomicSingularitySystem(options);
}