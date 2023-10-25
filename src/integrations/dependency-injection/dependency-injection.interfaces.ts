import { DIInjectorFunction, DIProviderFunction, DIProviderFunctionWithConfig } from ".";

/**
 * Mostly here to ensure that the DIMiddleware system
 * correctly implements our types, and that there are no
 * differences
 */
export interface DependencyInjectionInterface {
  provide: DIProviderFunction;
  provideWithConfig: DIProviderFunctionWithConfig;

  inject: DIInjectorFunction;
}