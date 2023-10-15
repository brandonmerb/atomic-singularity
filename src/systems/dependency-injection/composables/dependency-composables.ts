import "reflect-metadata";
import { Constructable } from "@/types/constructable.type";

export function identifyDependencies<T>(obj: Constructable<T>) {
  console.log(Reflect.getMetadataKeys(obj));
}