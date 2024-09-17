import { Instantiable, Token } from "./types.js";

export interface ClassProvider<T> {
  useClass: Instantiable<T>;
}

export interface ValueProvider<T> {
  useValue: T;
}

export interface FactoryProvider<T> {
  inject?: Token[];

  useFactory: (...args: any[]) => T;
}

export type Provider<T = any> =
  | ClassProvider<T>
  | ValueProvider<T>
  | FactoryProvider<T>;

export const isClassProvider = <T>(
  provider: Provider<T>
): provider is ClassProvider<any> => {
  return !!(provider as ClassProvider<T>).useClass;
};

export const isValueProvider = <T>(
  provider: Provider<T>
): provider is ValueProvider<any> => {
  return !!(provider as ValueProvider<T>).useValue;
};

export const isFactoryProvider = <T>(
  provider: Provider<T>
): provider is FactoryProvider<any> => {
  return !!(provider as FactoryProvider<T>).useFactory;
};

export const isProvider = (provider: any): provider is Provider => {
  return (
    isClassProvider(provider) ||
    isValueProvider(provider) ||
    isFactoryProvider(provider)
  );
};
