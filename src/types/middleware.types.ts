import type { AtomicNebulaInterface } from "../interfaces/atomic-nebula.interface";
import type { AtomicSingularitySystem } from "../atomic-singularity.system";
import type { NebulaBuilder } from "../helpers/utility.helpers";

export type ClassConstructor = new (app?: AtomicSingularitySystem) => AtomicNebulaInterface;
export type ArrowConstructor = (app?: AtomicSingularitySystem) => AtomicNebulaInterface;

export type MiddlewareUseFunction = ClassConstructor | ArrowConstructor | NebulaBuilder | AtomicNebulaInterface;