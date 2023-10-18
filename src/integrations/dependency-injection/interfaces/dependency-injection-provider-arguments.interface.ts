export interface DependencyInjectionProviderArguments<TypeOfProvider = any> {
  provider: TypeOfProvider;
  symbol?: any;
  options?: any;
}