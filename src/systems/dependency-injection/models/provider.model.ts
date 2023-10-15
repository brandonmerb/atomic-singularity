import { Constructable } from "@/types/constructable.type";
import { ProviderScope } from "../constants/provider-scopes.constant";
import { ProviderLifetimes } from "../constants/provider-lifetimes.constant";
import { DependencyTokenType } from "../types/dependency-token.type";

export class ProviderModel<ConstructorFunctionType = any> {

  /**
   * Create a new provider model.
   * @param instantiater The function to use to instantiate this provider
   * @param token The token to use to represent it. If no token is provided, then we'll default to a string representation of the instantiater (often a constructor function)
   * @param eager Whether to instantiate the provider on import, or to wait
   * @param lifetime Lifetime options - WIP
   * @param scope Scope options - WIP
   */
  constructor(
    public instantiater: Constructable<ConstructorFunctionType>,
    private token?: DependencyTokenType,
    public isAsyncValueProvider = false,
    public eager: boolean = false,
    public lifetime: ProviderLifetimes = ProviderLifetimes.Singleton,
    public scope: ProviderScope = ProviderScope.Global,
  ) {
  }

  /**
   * Get a token for this provider
   * @returns A token. One will be generated when not provided.
   */
  public getToken(): DependencyTokenType {
    if (this.token == null) {
      return this.instantiater.toString();
    }
    return this.token;
  }

  /**
   * Figure out all classes we inherit from through the instaniater
   */
  public getClassDependencies(): Constructable<any>[] {
    // TODO: Eventually this should use reflection to search for dependencies.
    //       For now we can just use our override flag from metadata
    // console.log(getMetadataKeys(this));

    return [];
  }
}