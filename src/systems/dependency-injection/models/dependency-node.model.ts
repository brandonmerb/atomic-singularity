import { ProviderModel } from "./provider.model";

export class DependencyNode {
  constructor(
    public symbol: any,
    public providerModel?: ProviderModel | null,
    public object?: any
  ) {
  }
}