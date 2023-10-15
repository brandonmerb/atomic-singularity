/**
 * These are all DI system test cases to view show how typing can be tracked/etc
 */

export interface InterfaceA {
}

export interface InterfaceB extends InterfaceA {
}

export class ClassA {
}

export class ClassB extends ClassA {
}

export abstract class AbstractA {
}

export abstract class AbstractB extends AbstractA {
}

export class ClassThatImplementsInterface implements InterfaceA {
}

export class ClassThatImplementsTwoInterfaces implements InterfaceB {
}

export class ClassThatExtendsAbstract extends AbstractA {
}

export class ClassThatExtendsTwoAbstracts extends AbstractB {
}

export class ClassThatDoesItAll extends AbstractB implements InterfaceB {
}