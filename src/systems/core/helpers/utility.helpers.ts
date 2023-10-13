import { AtomicSingularitySystem } from "../atomic-singularity.system";
import { AtomicModuleInterface } from "../interfaces/atomic-module.interface";

export function createModule<ModuleType extends AtomicModuleInterface>(options: ModuleType): ModuleType {
  return options;
}

export function useAtomicApi(): AtomicSingularitySystem {
  return new AtomicSingularitySystem();
}