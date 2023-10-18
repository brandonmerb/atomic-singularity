function prefix(property: string) {
  return `atomicdesign:${property}`;
}

export const DI_METADATA_ATTRIBUTES = {
  methodsWithInjections: Symbol(prefix("methodsWithInjections"))
}