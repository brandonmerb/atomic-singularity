import type { DependencyTokenType } from '@dependency-injection';
import { SingletonAlreadyInstantiated } from "@/errors/singleton-errors";
import { DependencyGraph } from './dependency-graph';
import { ModuleLogService } from '@logging';

export class DependencyInjectionSystem {
  public static _instance: DependencyInjectionSystem;
  protected logger: ModuleLogService = new ModuleLogService({ name: 'DI-SYSTEM' })

  protected dependencyGraph: DependencyGraph = new DependencyGraph(this.logger);

  constructor() {
    if (DependencyInjectionSystem._instance != null) {
      throw new SingletonAlreadyInstantiated("A dependency injection instance already exists");
    }

    DependencyInjectionSystem._instance = this;
  }

  static get(): DependencyInjectionSystem {
    if (DependencyInjectionSystem._instance == null) {
      return new DependencyInjectionSystem();
    }
    return DependencyInjectionSystem._instance;
  }

  // public resolve<T>(token: DependencyTokenType): T {
  //   return null;
  // }
}