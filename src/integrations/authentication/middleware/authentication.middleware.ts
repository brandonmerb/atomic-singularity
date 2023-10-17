import { SingletonAlreadyInstantiated } from "../../../errors/singleton-errors";

/**
 * Authentication Middleware to allow referencing common authentication
 * and authorization related actions without creating forcing a framework
 * choice on devs. This is intended to be a pretty basic middleware
 * @notimplemented Still WIP
 */
export class AuthenticationMiddleware {

  // Private property for storing the singleton
  private static _instance: AuthenticationMiddleware;

  // Public property for accessing the Authentication Middleware instance
  public static get instance(): AuthenticationMiddleware {
    // If there is no instance, instantiate one
    if (this._instance == null) {
      this._instance == new this()
    }
    return this._instance;
  }

  /**
   * Insantiate our an instance of our authentication middleware
   * TODO: Make certain aspects of this more configurable, such as being able
   * to disable swallowing errors (and logging) in our provider/inject methods
   */
  constructor(
  ) {
    // Check to make sure this class isn't being instantiated more than once
    if (AuthenticationMiddleware._instance != null) {
      throw new SingletonAlreadyInstantiated("AuthenticationMiddleware has already been instantiated");
    }

    // Make sure we update the private property with our instance
    AuthenticationMiddleware._instance = this;
  }
}