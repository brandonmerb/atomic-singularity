import { AtomicSingularitySystemOptionsInterface } from "@/interfaces/atomic-singularity-system-options.interface";
import { LifeCycle } from "@/enums/life-cycle.enum";
import { AtomicNebulaInterface } from "@/interfaces/atomic-nebula.interface";
import { BehaviorSubject, Subject, filter, takeUntil } from "rxjs";
import { AsyncActivationFunction } from "@/types/executor-functions.types";
import { ArrowConstructor, ClassConstructor, MiddlewareUseFunction } from "./types/middleware.types";
import { NebulaBuilder } from ".";

export class AtomicSingularitySystem {
  public config: AtomicSingularitySystemOptionsInterface = {
    useDefaultNebula: true
  };

  public static instance: AtomicSingularitySystem;

  public nebulas: Array<AtomicNebulaInterface> = [];

  public onModuleActivationSubject = new Subject<AtomicNebulaInterface>();
  public afterModuleActivationSubject = new Subject<AtomicNebulaInterface>();
  public onLifeCycle = new BehaviorSubject<LifeCycle>(LifeCycle.BeforeStart);

  constructor(options?: Partial<AtomicSingularitySystemOptionsInterface>) {
    this.config = {...options, ...this.config};
    AtomicSingularitySystem.instance = this;
  }

  public use(middleware: MiddlewareUseFunction): this {
    let inst: AtomicNebulaInterface;

    // Determine what type of middleware we got, and take necessary execution steps
    if (middleware instanceof NebulaBuilder) {
      // Nebula builder, so let's build it
      inst = middleware.build();
    } else if (typeof middleware == "object") {
      // This was an object directly, so we assume it's prepared
      inst = middleware;
    } else if (typeof middleware == "function") {
      // This is either a class constructor or an arrow constructor, so we'll try both
      try {
        inst = new (middleware as ClassConstructor)(this);
      } catch (ex) {
        inst = (middleware as ArrowConstructor)(this);
      }
    } else {
      // This didn't appear to be any of the above, so we'll immediately return since no other
      // formats are supported
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
        this.onModuleActivationSubject
          .pipe(
            takeUntil(this.onLifeCycle.pipe(filter((cycle) => cycle !== LifeCycle.BeforeStart)))
          )
          .subscribe(async (module) => {await (inst.onModuleActivation as AsyncActivationFunction)(module)});
      } else {
        inst.onModuleActivation.forEach((func) => {
          this.onModuleActivationSubject
            .pipe(
              takeUntil(this.onLifeCycle.pipe(filter((cycle) => cycle !== LifeCycle.BeforeStart)))
            )
            .subscribe(async (module) => await func(module));
        });
      }
    }

    if (!!inst.afterModuleActivation) {
      if (typeof inst.afterModuleActivation === "function") {
        this.afterModuleActivationSubject
          .pipe(
            takeUntil(this.onLifeCycle.pipe(filter((cycle) => cycle !== LifeCycle.BeforeStart)))
          )
          .subscribe(async (module) => {await (inst.afterModuleActivation as AsyncActivationFunction)(module)});
      } else {
        inst.afterModuleActivation.forEach((func) => {
          this.afterModuleActivationSubject
            .pipe(
              takeUntil(this.onLifeCycle.pipe(filter((cycle) => cycle !== LifeCycle.BeforeStart)))
            )
            .subscribe(async (module) => await func(module));
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

    this.nebulas.forEach((nebula) => {
      this.afterModuleActivationSubject.next(nebula);
    });

    this.onModuleActivationSubject.complete();

    this.onLifeCycle.next(LifeCycle.Started);
  }

  public end(): void {
    this.onLifeCycle.next(LifeCycle.BeforeEnd);
    this.onLifeCycle.next(LifeCycle.Ended);
  }
}