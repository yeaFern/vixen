import {
  DuplicateProviderTokenError,
  DuplicateSingletonInstanceError,
  UnknownTokenError,
} from "./errors";
import type { Provider } from "./providers";
import type { Any, Scope, Token } from "./types";

export interface ProviderRegistryEntry<T = Any> {
  provider: Provider<T>;
  scope: Scope;
  instance?: T;
}

/**
 * A simple wrapper around a `Map` used for associating tokens with providers.
 */
export class ProviderRegistry {
  protected map = new Map<Token, ProviderRegistryEntry>();

  assign<T>(
    token: Token<T>,
    entry: Omit<ProviderRegistryEntry<T>, "instance">
  ): void {
    if (this.map.has(token)) {
      throw new DuplicateProviderTokenError(token);
    }

    this.map.set(token, entry);
  }

  get<T>(token: Token<T>): ProviderRegistryEntry<T> {
    const result = this.map.get(token);

    if (result === undefined) {
      throw new UnknownTokenError(token);
    }

    return result;
  }

  clear(): void {
    this.map.clear();
  }

  has<T>(token: Token<T>): boolean {
    return this.map.has(token);
  }
}
