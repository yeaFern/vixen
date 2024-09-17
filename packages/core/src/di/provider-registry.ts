import { Provider } from "./providers";
import { Scope, Token } from "./types";
import { DuplicateProviderTokenError } from "./errors";

export interface ProviderRegistryEntry<T = any> {
  provider: Provider<T>;
  scope: Scope;
  instance?: T;
}

/**
 * A simple wrapper around a `Map` used for associating tokens with providers.
 */
export class ProviderRegistry {
  protected map = new Map<Token<any>, ProviderRegistryEntry>();

  assign<T>(token: Token<T>, entry: ProviderRegistryEntry<T>): void {
    if (this.map.has(token)) {
      throw new DuplicateProviderTokenError(token);
    }

    this.map.set(token, entry);
  }

  get<T>(token: Token<T>): ProviderRegistryEntry<T> | undefined {
    return this.map.get(token);
  }

  clear(): void {
    this.map.clear();
  }

  has<T>(token: Token<T>): boolean {
    return this.map.has(token);
  }
}
