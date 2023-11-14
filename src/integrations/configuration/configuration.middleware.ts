// import { AtomicNebulaInterface } from "@/index";
import { useDI } from '@/index';
import type { AnyNebulaType } from '../../types/generic.types';
import { DIProviderConfig, DIToken } from '../dependency-injection';

const diMiddleware = useDI();

export class ConfigurationMiddleware {
  // Private property for storing the singleton
  private static _instance: ConfigurationMiddleware;

  // Private property used for caching providers until an injection
  // private providersBeforeInit: Array<DependencyInjectionProviderArguments> = [];

  // Public property for accessing the Dependency Injection Middleware instance
  public static get instance(): ConfigurationMiddleware {
    // If there is no instance, instantiate one
    if (this._instance == null) {
      this._instance == new this()
    }
    return this._instance;
  }

  public addConfigurationDefault<DefaultValue = {}>(nebula: AnyNebulaType, providerToken: DIToken, defaultValue: DefaultValue): this {
    
    return this;
  }
}