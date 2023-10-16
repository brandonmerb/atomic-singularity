import { describe, test } from "@jest/globals";

import { useAtomicApi } from "@/index";

function systemPrefix(name: string): string {
  return `Core System: ${name}`;
}

describe(systemPrefix("System functionality"), () => {
  test("Instantiates required systems", () => {
    useAtomicApi();
  });
})