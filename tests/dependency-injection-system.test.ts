import { describe, test, expect,  } from "@jest/globals";

import { DependencyInjectionSystem } from "@dependency-injection";
import { SingletonAlreadyInstantiated } from "@/errors/singleton-errors";

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
  })
});