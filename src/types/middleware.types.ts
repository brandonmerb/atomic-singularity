import { AtomicNebulaInterface } from "@/interfaces/atomic-nebula.interface";
import type { AtomicSingularitySystem } from "../atomic-singularity.system";

export type ClassConstructor = new (app: AtomicSingularitySystem) => AtomicNebulaInterface;
export type ArrowConstructor = (app: AtomicSingularitySystem) => AtomicNebulaInterface;

export type MiddlewareUseFunction = ClassConstructor | ArrowConstructor | AtomicNebulaInterface;