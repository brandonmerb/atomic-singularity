import { AtomicModuleInterface } from "../core/interfaces/atomic-module.interface";
import { AtomicSingularitySystem } from "../core/atomic-singularity.system";

export type ExecutorFunction<ModuleType extends AtomicModuleInterface = AtomicModuleInterface> = 
  (app: AtomicSingularitySystem, module: ModuleType) => boolean;