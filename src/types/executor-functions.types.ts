import { AtomicNebulaInterface } from "../interfaces/atomic-nebula.interface";
import { AtomicSingularitySystem } from "../atomic-singularity.system";

export type ExecutorFunction<NebulaType extends AtomicNebulaInterface = AtomicNebulaInterface> = 
  (app: AtomicSingularitySystem, nebula: NebulaType) => boolean;

export type AsyncActivationFunction = (nebula: AtomicNebulaInterface) => Promise<boolean>;