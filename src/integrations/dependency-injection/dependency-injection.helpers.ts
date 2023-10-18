import { Constructable } from "../../types/constructable.type";
import { DI_METADATA_ATTRIBUTES } from "./dependency-injection.constants";
import { DependencyInjectionPropertyStructureInterface } from "./interfaces/dependency-injection-property-structure.interface";

export function injectIntoArguments(injectorData: DependencyInjectionPropertyStructureInterface, propertyName: string, ...args: any[]) {
  
}

export function wrapInjectableMethods() {
  
}

export function injectableWrapper() {

}

export function injectableMixin<T extends Constructable>(constructor: T): T {
  return class extends constructor {
    constructor(...args: any[]) {
      // injectIntoArguments(args);

      super(args);
      Object.keys(Reflect.getMetadata(DI_METADATA_ATTRIBUTES.methodsWithInjections, this))
        .forEach((key) => console.log(Reflect.get(this, key)));
      
    }
  }
}