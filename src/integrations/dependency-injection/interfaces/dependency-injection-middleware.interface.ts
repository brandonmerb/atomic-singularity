import { DependencyInjectionProviderFunction, DependencyInjectionInjectionFunction, DependencyInjectionSymbolGeneratorFunction } from "../dependency-injection.types";

/**
 * This interface basically just exists to make sure the middleware implements
 * the same method signatures as the types declare
 */
export interface DependencyInjectionMiddlewareInterface {
  setGeneratorFunction: (arg: DependencyInjectionSymbolGeneratorFunction) => this;
  setProviderFunction: (arg: DependencyInjectionProviderFunction) => this;
  setInjectionFunction: (arg: DependencyInjectionInjectionFunction) => this;

  provide: DependencyInjectionProviderFunction;
  inject: DependencyInjectionInjectionFunction
}