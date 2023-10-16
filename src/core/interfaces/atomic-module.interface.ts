export interface AtomicModuleInterface {
  name: string;
  version?: string;

  disabled?: boolean;

  imports?: AtomicModuleInterface[];

  providers?: AtomicModuleInterface[];
}