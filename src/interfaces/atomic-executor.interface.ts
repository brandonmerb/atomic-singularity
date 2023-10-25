import type { ExecutorFunction } from "../types/executor-functions.types";
import type { AtomicModuleInterface } from "./atomic-nebula.interface";

export interface OnImport {
  onImport(module: AtomicModuleInterface, executor: ExecutorFunction): boolean;
}

export interface OnMiddleware {
  onMiddleware(module: AtomicModuleInterface, executor: ExecutorFunction): boolean;
}

export interface OnStarting {
  onStarting(module: AtomicModuleInterface, executor: ExecutorFunction): boolean;
}

export interface OnStarted {
  onStarted(module: AtomicModuleInterface, executor: ExecutorFunction): boolean;
}

export interface OnEnding {
  onEnding(module: AtomicModuleInterface, executor: ExecutorFunction): boolean;
}

export interface OnEnded {
  onEnded(module: AtomicModuleInterface, executor: ExecutorFunction): boolean;
}