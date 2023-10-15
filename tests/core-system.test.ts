import { describe, test, expect,  } from "@jest/globals";

import { AtomicSingularitySystem, useAtomicApi } from "@core";
import { DependencyInjectionSystem } from "@dependency-injection";
import { LogSystem } from "@logging";

function systemPrefix(name: string): string {
  return `Core System: ${name}`;
}

describe(systemPrefix("System functionality"), () => {
  test("Instantiates required systems", () => {
    useAtomicApi();

    expect(DependencyInjectionSystem)
      .not
      .toBeNull();
    
    expect(LogSystem)
      .not
      .toBeNull();
  });
})