import { SingletonAlreadyInstantiated } from "../../../errors/singleton-errors";
import { DependencyInjectionInjectionFunction, DependencyInjectionProviderFunction, DependencyInjectionSymbolGeneratorFunction } from "../dependency-injection.types";
import { LoggingMiddleware } from '../../logging/middleware/logging.middleware';
/**
 * Dependency Injection Middleware to allow using a DI
 * system without creating a hard link to one in particular
 */
export class DependencyInjectionMiddleware implements DependencyInjectionMiddleware {
  // Symbol generator used when a provider is given with no symbol
  // Probably will not need an override
  private symbolGeneratorFunction: DependencyInjectionSymbolGeneratorFunction = this.defaultSymbolGenerator;

  // Injection function used. Meant to be overriden
  private injectionFunction: DependencyInjectionInjectionFunction;

  // Provider function used. Meant to be overriden
  private providerFunction: DependencyInjectionProviderFunction;

  // Private property for storing the singleton
  private static _instance: DependencyInjectionMiddleware;

  // Public property for accessing the Dependency Injection Middleware instance
  public static get instance(): DependencyInjectionMiddleware {
    // If there is no instance, instantiate one
    if (this._instance == null) {
      this._instance == new this()
    }
    return this._instance;
  }

  /**
   * Insantiate our an instance of our DI middleware
   * TODO: Make certain aspects of this more configurable, such as being able
   * to disable swallowing errors (and logging) in our provider/inject methods
   */
  constructor(
  ) {
    // Check to make sure this class isn't being instantiated more than once
    if (DependencyInjectionMiddleware._instance != null) {
      throw new SingletonAlreadyInstantiated("DependencyInjectionMiddleware has already been instantiated");
    }

    // Make sure we update the private property with our instance
    DependencyInjectionMiddleware._instance = this;
  }

  /**
   * Set the function to use when configuring providers. This is intended to be used
   * by whatever framework you're using for DI. Alternatively you can write your own
   * integration by writing a wrapper around your DI framework's provide function that
   * will proxy that call every time the DependencyInjectionMiddleware.provide method is
   * called
   * @param func A DependencyInjectionProviderFunction to use
   * @returns An instance of this class for daisy chaining
   */
  public setProviderFunction(func: DependencyInjectionProviderFunction): this {
    this.providerFunction = func;
    return this;
  }

  /**
   * Set the function to use when configuring injections. This is intended to be used
   * by whatever framework you're using for DI. Alternatively you can write your own
   * integration by writing a wrapper around your DI framework's inject function that
   * will proxy that call every time the DependencyInjectionMiddleware.inject method is
   * called
   * @param func A DependencyInjectionInjectionFunction to use
   * @returns An instance of this class for daisy chaining
   */
  public setInjectionFunction(func: DependencyInjectionInjectionFunction): this {
    this.injectionFunction = func;
    return this;
  }

  /**
   * Set the function to use when generating symbols for DI providers. You'll probably
   * never have to provide an alternative implementation of this. This method is provided
   * in the event your DI system requires some weird integration
   * @param func A DependencyInjectionSymbolGeneratorFunction to use
   * @returns An instance of this class for daisy chaining
   */
  public setGeneratorFunction(func: DependencyInjectionSymbolGeneratorFunction): this {
    this.symbolGeneratorFunction = func;
    return this;
  }

  /**
   * Provide a value to use for the corresponding symbol
   * @param provider The provider of the value
   * @param symbol Any valid symbol to retrieve a provider by. By default you're not
   * restricted to using Symbol types. You can also use strings or other values, though
   * those will not necessarily be unique
   * @returns An instance of this class for daisy chaining
   */
  public provide<TypeOfProvider>(provider: TypeOfProvider, symbol?: any, options?: any): this {
    if (symbol == null) {
      symbol = this.symbolGeneratorFunction(provider);
    }
    try {
      this.providerFunction(provider, symbol);
    } catch {
      LoggingMiddleware.instance.getLogger().error(`Failed to provide value for symbol: ${symbol.toString()}`);
    }
    return this;
  }

  /**
   * Retrieve the value of a corresponding symbol for injection
   * @param symbol Any valid symbol to retrieve a provider by. By default you're not
   * restricted to using Symbol types. You can also use strings or other values, though
   * those will not necessarily be unique
   * @returns The corresponding value of the provider
   */
  public inject<TypeOfProvider = (any | undefined)>(symbol: any): TypeOfProvider {
    return this.injectionFunction(symbol);
  }

  /**
   * The default symbol generator. This method will attempt to return
   * a string representation of whatever the provider is, as long as it's
   * not a symbol. For symbols it will return the symbol itself
   * @param provider The provider to generate a symbol for
   * @returns A valid symbol for the provider
   */
  private defaultSymbolGenerator(provider: any): any {
    // It doesn't make sense to use a string representation of a Symbol
    // as a symbol for itself, so we return the actual symbol instead
    if (typeof provider === "symbol") { return provider };

    // Otherwise we lazily attempt to return a string representation of the object
    return String(provider);
  }
}