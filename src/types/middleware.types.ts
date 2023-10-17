import type { AtomicSingularitySystem } from "../core/atomic-singularity.system";

export type MiddlewareUseFunction<ReturnValue = boolean> = (app: AtomicSingularitySystem) => ReturnValue | false;

export interface AtomicSingularityMiddleware {
}