import { AbstractBaseNebula } from "./abstract-base.nebula";
import { AtomicModuleInterface } from '../interfaces/atomic-module.interface';

/**
 * Pretty much a dumb nebula to allow modules to activate before
 * a real Nebula runs. This is a work around right now, until
 * further work on the Module & Nebula system happens. The Module
 * system should not change. The only things that should are how
 * nebulas store modules (shouldn't anymore), the order they get
 * to activate them, and the restriction to one nebula per instance
 */
export class DefaultNebula extends AbstractBaseNebula<AtomicModuleInterface> {
  start(): void {
  }
}