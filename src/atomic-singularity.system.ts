import { AtomicSingularitySystemOptionsInterface } from "@/interfaces/atomic-singularity-system-options.interface";
import { LifeCycle } from "@/enums/life-cycle.enum";
import { AtomicNebulaInterface } from "@/interfaces/atomic-nebula.interface";
import { BehaviorSubject, Subject } from "rxjs";
import { AsyncActivationFunction } from "@/types/executor-functions.types";
import { ArrowConstructor, ClassConstructor, MiddlewareUseFunction } from "./types/middleware.types";

export class AtomicSingularitySystem {
  public config: AtomicSingularitySystemOptionsInterface = {
    useDefaultNebula: true
  };

  public static instance: AtomicSingularitySystem;

  public nebulas: Array<AtomicNebulaInterface> = [];

  public onModuleActivationSubject = new Subject<AtomicNebulaInterface>();
  public onLifeCycle = new BehaviorSubject<LifeCycle>(LifeCycle.BeforeStart);

  constructor(options?: Partial<AtomicSingularitySystemOptionsInterface>) {
    this.config = {...options, ...this.config};
    AtomicSingularitySystem.instance = this;
  }

  public use(middleware: MiddlewareUseFunction): this {
    let inst: AtomicNebulaInterface;
    if (typeof middleware === "object") {
      inst = middleware;
    } else if (typeof middleware === "function") {
      try {
        inst = new (middleware as ClassConstructor)(this);
      } catch (ex) {
        inst = (middleware as ArrowConstructor)(this);
      }
    } else {
      return this;
    }

    // This nebula is disabled, so skip the rest
    if (inst?.disabled === true) {
      return this;
    } else {
      // Not disabled, so add the nebula to our nebula array
      this.nebulas.push(inst);
    }

    // If this has an onModuleActivation function(s) we should hook that up immediately
    if (!!inst.onModuleActivation) {
      if (typeof inst.onModuleActivation === "function") {
        this.onModuleActivationSubject.subscribe(async (module) => await (inst.onModuleActivation as AsyncActivationFunction)(module));
      } else {
        inst.onModuleActivation.forEach((func) => {
          this.onModuleActivationSubject.subscribe(async (module) => await func(module));
        });
      }
    }

    // Recursively register all middleware. The Default Nebula is responsible
    // for hooking up providers and other event subscribers
    if (!!inst.imports && inst.imports.length > 0) {
      inst.imports.forEach((nebula) => {
        this.use(nebula);
      });
    }

    return this;
  }

  public start(): void {
    this.nebulas.forEach((nebula) => {
      this.onModuleActivationSubject.next(nebula);
    });

    this.onLifeCycle.next(LifeCycle.Started);
  }
}