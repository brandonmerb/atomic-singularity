export enum ProviderLifetimes {
  /**
   * A singleton lifetime will use the provider as a singleton class. It
   * will be instantiated once, and reused with every reference.
   */
  Singleton = "singleton",

  /**
   * A transient lifetime will cause the provider to be instantiated
   * each time the provider is accessed. This creates a new provider
   * effectively for each call.
   */
  Transient = "transient",

  /**
   * A request lifetime will act similar to a singleton, however the
   * created provider is specific to the current HTTP Request. This
   * scope is not valid for non-rest APIs.
   */
  Request = "request",

  /**
   * A session lifetime will act similar to a singleton, however the
   * created provider is specific to the User Session in the current 
   * scope.
   */
  Session = "session"
}