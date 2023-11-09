import { AtomicNebulaInterface } from "../interfaces/atomic-nebula.interface";

export type AnyNebulaType<OverrideType extends AtomicNebulaInterface = AtomicNebulaInterface> = OverrideType;