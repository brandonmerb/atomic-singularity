import { describe, test, expect,  } from "@jest/globals";

function systemPrefix(name: string): string {
  return `Authentication System: ${name}`;
}

describe(systemPrefix("System functionality"), () => {
  test("Stub", () => {

  })
})