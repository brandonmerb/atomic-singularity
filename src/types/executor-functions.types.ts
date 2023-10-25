import { AtomicNebulaInterface } from "../interfaces/atomic-nebula.interface";
import { AtomicSingularitySystem } from "../atomic-singularity.system";

export type ExecutorFunction<NebulaType extends AtomicNebulaInterface = AtomicNebulaInterface> = 
  (app?: AtomicSingularitySystem, nebula?: NebulaType) => boolean | void | null | undefined;

export type AsyncActivationFunction<NebulaType extends AtomicNebulaInterface = AtomicNebulaInterface> = (nebula?: NebulaType) => Promise<boolean>;