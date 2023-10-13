import { AtomicSingularitySystem } from "../atomic-singularity.system";
import { AtomicModuleInterface } from "../interfaces/atomic-module.interface";

export function createModule(options: AtomicModuleInterface): AtomicModuleInterface {
  return options;
}

export function useAtomicApi(): AtomicSingularitySystem {
  return new AtomicSingularitySystem();
}