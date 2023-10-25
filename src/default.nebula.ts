import { AtomicSingularitySystem } from "./atomic-singularity.system";
import { DependencyInjectionMiddleware, ExecutorFunction, LifeCycle, LoggingMiddleware } from ".";
import { AtomicNebulaInterface } from "./interfaces/atomic-nebula.interface";
import { filter } from "rxjs/operators";

export class DefaultNebula implements AtomicNebulaInterface {
  /**
   * Whatever happens in the constructor should be run before
   * the Nebulas have finished registering themselves
   * @param app 
   */
  constructor(app: AtomicSingularitySystem){

  }

  name: string = "Default Nebula";
  // version?: string | undefined;
  // disabled?: boolean | undefined;
  // imports?: MiddlewareUseFunction<this>[] | undefined;
  // providers?: any[] | undefined;
  // onModuleActivation?: Promise<ExecutorFunction> | Promise<ExecutorFunction>[] | undefined;
  // onBeforeStart?: ExecutorFunction | ExecutorFunction[] | undefined;
  // onStarted?: ExecutorFunction | ExecutorFunction[] | undefined;
  // onBeforeEnd?: ExecutorFunction | ExecutorFunction[] | undefined;
  // onBeforeEnded?: ExecutorFunction | ExecutorFunction[] | undefined;

  // onModuleActivation = (app: AtomicSingularitySystem, module: any): Promise<boolean> => {
  //   return new Promise((resolve, reject) => {
  //     resolve(true);
  //   });
  // }

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
        filter(stage => stage === workAround[eventListenerName])
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