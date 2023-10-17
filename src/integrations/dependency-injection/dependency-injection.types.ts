import { Constructable } from "../../types/constructable.type";

/**
 * A function that takes any thing that can be used to create a DependencyInjectionSymbol
 * and actually creates one
 */
export type DependencyInjectionSymbolGeneratorFunction<SymbolReturnType = any> = (object: any) => SymbolReturnType

/**
 * The DI Provider functions should be pretty straightforward to use. You
 * provider the symbol that you want, and the framework does the rest behind
 * the scenes to inject the correct value
 */
export type DependencyInjectionInjectionFunction<ReturnType = (any | undefined)> = (symbol: any) => ReturnType;

/**
 * Generally DI frameworks allow arbitrary values to be provided, so we don't
 * restrict the type of Value. We do provide a generic for type safety if
 * necessary for uses in other APIs
 */
export type DependencyInjectionProviderFunction<ValueType = any> = (value: ValueType, symbol?: any, options?: any) => void;