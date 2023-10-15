import { describe, test, expect,  } from "@jest/globals";

import { LogSystem } from "@logging";
import { SingletonAlreadyInstantiated } from "@/errors/singleton-errors";

function systemPrefix(name: string): string {
  return `Logging System: ${name}`;
}

describe(systemPrefix("System functionality"), () => {
  test("Creates instance if none exist", () => {
    expect(LogSystem.instance)
      .toBeInstanceOf(LogSystem);
  });

  test("Cannot directly instantiate more than one", () => {
    const shouldError = () => {
      // Instantiating it twice should throw an error
      new LogSystem();
      new LogSystem();
    }

    // Validate the error is thrown
    expect(shouldError)
      .toThrow(SingletonAlreadyInstantiated)
  });

  test("Cannot instantiate more than one through get", () => {
    const shouldError = () => {
      // Get should instantiate one, so this should throw an error
      LogSystem.instance;
      new LogSystem();
    }

    // Validate the error is thrown
    expect(shouldError)
      .toThrow(SingletonAlreadyInstantiated)
  });
})