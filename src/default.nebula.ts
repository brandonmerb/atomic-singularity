import { AtomicSingularitySystem } from "./atomic-singularity.system";
import { DIProviderConfig, DependencyInjectionMiddleware, ExecutorFunction, LifeCycle, LoggerToken, LoggingMiddleware, SystemVersionToken } from ".";
import { AtomicNebulaInterface } from "./interfaces/atomic-nebula.interface";
import { filter, takeWhile } from "rxjs/operators";

export class DefaultNebula implements AtomicNebulaInterface {
  /**
   * Whatever happens in the constructor should be run before
   * the Nebulas have finished registering themselves. This is
   * equivalent to the preactivation method on the Nebula builder
   * @param app 
   */
  constructor(app: AtomicSingularitySystem){
  }

  public name: string = "Default Nebula";
  public providers: Array<DIProviderConfig> = [
    {
      value: () => LoggingMiddleware.instance.getLogger(),
      token: LoggerToken,
      type: "factory"
    },
    {
      // TODO: Make this dynamically insert from package.json via Vite build tools
      value: "1.0.0",
      token: SystemVersionToken,
      type: "value"
    }
  ]

  async onModuleActivation(module: AtomicNebulaInterface): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (module.disabled === true) {
        reject(`${module.name} is disabled`);
      }
      LoggingMiddleware.instance
        .getLogger()
        .info(`Activated module ${module.name}`);

      this.registerProviders(module);
      this.registerEvents(module);
      resolve(true);
    });
  }

  public registerProviders(module: AtomicNebulaInterface): this {
    if (module.providers && module.providers.length > 0) {
      module.providers.forEach((provider) => {
        if (Object.keys(provider).includes("value")) {
          DependencyInjectionMiddleware.instance.provideWithConfig(provider as DIProviderConfig)
        } else {
          DependencyInjectionMiddleware.instance.provide(provider)
        }
      });
    }
    return this;
  }

  public registerEvents(module: AtomicNebulaInterface): this {
    this.registerEventByListenerName(module, "onBeforeStart")
        .registerEventByListenerName(module, "onStarted")
        .registerEventByListenerName(module, "onBeforeEnd")
        .registerEventByListenerName(module, "onEnded");
    return this;
  }

  public registerEventByListenerName(module: AtomicNebulaInterface, eventListenerName: string): this {
    const val = module[eventListenerName as keyof AtomicNebulaInterface];
    if (!val) {
      return this;
    }

    // Work around to avoid writing long if/elseif
    // needs cleanup like rest of revision
    const workAround: {[key: string]: LifeCycle} = {
      "onBeforeStart": LifeCycle.BeforeStart,
      "onStarted": LifeCycle.Started,
      "onBeforeEnd": LifeCycle.BeforeEnd,
      "onEnded": LifeCycle.Ended,
    }

    // Clean up?
    const executors: Array<ExecutorFunction> = typeof val === "function" ?
      [module[eventListenerName as keyof AtomicNebulaInterface] as ExecutorFunction] :
        module[eventListenerName as keyof AtomicNebulaInterface] as Array<ExecutorFunction>
    
    // Optimize this for unsubscribes when life cycle has been passed over
    AtomicSingularitySystem
      .instance
      .onLifeCycle
      .pipe(
        filter(stage => stage === workAround[eventListenerName]),
        takeWhile((stage) => stage === workAround[eventListenerName])
      )
      .subscribe(() => {
        executors.forEach((func) => {
          // Make sure we preserve the this context
          func.bind(module)(AtomicSingularitySystem.instance, module)
        });
      });

    return this;
  }
}