export interface Instantiable<T = any> {
  new (...args: any[]): T;
}

export type Token<T = any> = Instantiable<T> | string | symbol;

export const isNormalToken = (token: Token<any>): token is string | symbol => {
  return typeof token === "string" || typeof token === "symbol";
};

export const isConstructorToken = (
  token: Token<any>
): token is Instantiable<any> => {
  return typeof token === "function";
};

export interface PropertyDependency<T = any> {
  token: Token<T>;
  property: string | symbol;
}

export enum Scope {
  /** Each resolve will return the same instance. Singleton scope is used by default. */
  Singleton,

  /** Each resolve will return an newly created instance. */
  Transient,
}
