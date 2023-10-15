import { describe, test, expect, } from "@jest/globals";

import { DependencyInjectionSystem, identifyDependencies } from "@dependency-injection";
import { SingletonAlreadyInstantiated } from "@/errors/singleton-errors";

// All sorts of test cases for our DI system. They're stored elsewhere to keep this file
// a little cleaner
import {
  AbstractA,
  AbstractB,
  ClassA,
  ClassB,
  ClassThatDoesItAll,
  ClassThatExtendsAbstract, 
  ClassThatExtendsTwoAbstracts, 
  ClassThatImplementsInterface, 
  ClassThatImplementsTwoInterfaces, 
  InterfaceA, 
  InterfaceB
} from "./resources/di-system-resources";

function systemPrefix(name: string): string {
  return `Dependency Injection System: ${name}`;
}

describe(systemPrefix("System functionality"), () => {
  test("Creates instance if none exist", () => {
    expect(DependencyInjectionSystem.get())
      .toBeInstanceOf(DependencyInjectionSystem);
  });

  test("Cannot directly instantiate more than one", () => {
    const shouldError = () => {
      // Instantiating it twice should throw an error
      new DependencyInjectionSystem();
      new DependencyInjectionSystem();
    }

    // Validate the error is thrown
    expect(shouldError)
      .toThrow(SingletonAlreadyInstantiated)
  });

  test("Cannot instantiate more than one through get", () => {
    const shouldError = () => {
      // Get should instantiate one, so this should throw an error
      DependencyInjectionSystem.get();
      new DependencyInjectionSystem();
    }

    // Validate the error is thrown
    expect(shouldError)
      .toThrow(SingletonAlreadyInstantiated)
  });
});

describe(systemPrefix("Dependencies"), () => {
  test("yes", () => {
    identifyDependencies(ClassThatDoesItAll);
  })
});