export class DependencyInjectionSystem {
  public static _instance: DependencyInjectionSystem;

  constructor() {
    DependencyInjectionSystem._instance = this;
  }

  static get(): DependencyInjectionSystem {
    if (DependencyInjectionSystem._instance == null) {
      return new DependencyInjectionSystem();
    }
    return DependencyInjectionSystem._instance;
  }

  public resolve<T>(token: any): T {
    return token;
  } 
}