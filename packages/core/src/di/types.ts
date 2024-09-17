// biome-ignore lint/suspicious/noExplicitAny: Shut Biome up without adding blanket exception for the whole project.
export type Any = any;

export interface Instantiable<T = Any> {
  new (...args: Any[]): T;
}

export type Token<T = Any> = Instantiable<T> | string | symbol;

export const isNormalToken = (token: Token<Any>): token is string | symbol => {
  return typeof token === "string" || typeof token === "symbol";
};

export const isConstructorToken = (
  token: Token
): token is Instantiable<Any> => {
  return typeof token === "function";
};

export interface PropertyDependency<T = Any> {
  token: Token<T>;
  property: string | symbol;
}

export enum Scope {
  /** Each resolve will return the same instance. Singleton scope is used by default. */
  Singleton = 0,

  /** Each resolve will return an newly created instance. */
  Transient = 1,
}
