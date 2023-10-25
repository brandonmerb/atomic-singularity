import type { Constructable } from '../../types/constructable.type';

/**
 * Mark the property or argument for injection on the object
 */
export function Inject(symbol?: any) {
  return (target: any, propertyKey: string, parameterIndex?: number) => {
    // if (!propertyKey) propertyKey = "constructor";
    // const currentDescriptors: DependencyInjectionPropertyStructureInterface = Reflect.getMetadata(DI_METADATA_ATTRIBUTES.methodsWithInjections, target) ?? {};
    // let injectionArr: any = [];
    // if (Reflect.has(currentDescriptors, propertyKey)) {
    //   injectionArr = Reflect.get(currentDescriptors, propertyKey) as Array<any>;
    // }
    // injectionArr.push({symbol, type: null, index: parameterIndex});
    // Reflect.set(currentDescriptors, propertyKey, injectionArr);
    
    // Reflect.defineMetadata(DI_METADATA_ATTRIBUTES.methodsWithInjections, currentDescriptors, target);
  }
}

/**
 * Decorator that binds to the DependencyInjectionMiddleware class to allow using
 * @Provide() on things like classes. This is not required to register a class
 * as a provider. It can also be done through the Providers field on an Atomic Module
 * @param args Arguments to pass to the DI system
 * @returns The constructor that was given
 */
// export function Provide<ClassType>(args?: Omit<DependencyInjectionProviderArguments, "provider">) {
//   return (constructor: Constructable<ClassType>) => {
//     // DependencyInjectionMiddleware.instance.provideWithArguments({provider: constructor, ...args});

//     return constructor;
//   }
// }