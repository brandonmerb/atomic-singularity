import { Constructable } from "@/index";

// export type DIFactoryToken = () => void;
export type DIClassToken<T = any> = Constructable<T>;
export type DIToken = symbol | string | DIClassToken

/**
 * 
 */
export type DIFactoryFunction<FactoryResult = any, ContainerType = any> = (dependencyContainer: ContainerType) => FactoryResult

/**
 * This function should be used to provide a way to create 
 * tokens based on a given valid Tokenizable object that will
 * be consistently recreated when given the same value. E.g.
 * it shouldn't do something like generate a symbol from a non-symbol
 * unless it consistently refers to the same symbol each time the function
 * is called with the same value.
 */
export type DISymbolGeneratorFunction = (valueToTokenize: DIToken) => DIToken;

/**
 * 
 */
export type DIInjectorFunction<ExpectedReturnType = any> = (token: DIToken) => ExpectedReturnType;

/**
 * 
 */
export type DIProviderFunction<ProviderType = any> = (provider: ProviderType, token?: DIToken, type?: DIProviderTypes, config?: any) => void

export type DIProviderFunctionWithConfig = (config: DIProviderConfig) => void;

/**
 * TODO
 */
export type DICreateContainerFunction = () => void;

export type DIProviderTypes = "class" | "factory" | "value";

export interface DIProviderConfig<ValueType = any, ConfigType = any> {
  value: ValueType;
  token?: DIToken;
  type?: DIProviderTypes;
  config?: ConfigType;
}