import type { AtomicSingularitySystem } from "../core/atomic-singularity.system";

export type MiddlewareUseFunction = (app: AtomicSingularitySystem) => boolean

export interface AtomicSingularityMiddleware {
}