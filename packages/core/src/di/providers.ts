import type { Any, Instantiable, Token } from "./types";

export interface ClassProvider<T> {
  useClass: Instantiable<T>;
}

export interface ValueProvider<T> {
  useValue: T;
}

export interface FactoryProvider<T> {
  inject?: Token[];

  useFactory: (...args: Any[]) => T;
}

export type Provider<T = Any> =
  | ClassProvider<T>
  | ValueProvider<T>
  | FactoryProvider<T>;

export const isClassProvider = <T>(
  provider: Provider<T>,
): provider is ClassProvider<Any> => {
  return !!(provider as ClassProvider<T>).useClass;
};

export const isValueProvider = <T>(
  provider: Provider<T>,
): provider is ValueProvider<Any> => {
  return !!(provider as ValueProvider<T>).useValue;
};

export const isFactoryProvider = <T>(
  provider: Provider<T>,
): provider is FactoryProvider<Any> => {
  return !!(provider as FactoryProvider<T>).useFactory;
};

export const isProvider = (provider: Any): provider is Provider => {
  return (
    isClassProvider(provider) ||
    isValueProvider(provider) ||
    isFactoryProvider(provider)
  );
};
