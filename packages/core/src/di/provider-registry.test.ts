import { ProviderRegistry } from "./provider-registry";
import { Scope } from "./types";

describe("ProviderRegistry", () => {
  it("can assign a token to an entry", () => {
    const registry = new ProviderRegistry();

    const token = Symbol("MY_TOKEN");

    registry.assign(token, {
      provider: {
        useValue: 100,
      },
      scope: Scope.Singleton,
    });

    expect(registry.has(token)).toBe(true);
    expect(registry.get(token)).toBeDefined();
  });

  it("can be cleared", () => {
    const registry = new ProviderRegistry();

    const token = Symbol("MY_TOKEN");

    registry.assign(token, {
      provider: {
        useValue: 100,
      },
      scope: Scope.Singleton,
    });

    registry.clear();

    expect(registry.has(token)).toBe(false);
    expect(registry.get(token)).toBeUndefined();
  });

  it("cannot assign multiple providers to a single token", () => {
    const registry = new ProviderRegistry();

    const token = Symbol("MY_TOKEN");

    registry.assign(token, {
      provider: {
        useValue: 100,
      },
      scope: Scope.Singleton,
    });

    expect(() => {
      registry.assign(token, {
        provider: {
          useValue: 100,
        },
        scope: Scope.Singleton,
      });
    }).toThrow();
  });

  it("returns the correct provider for a given token", () => {
    const registry = new ProviderRegistry();

    const token_a = Symbol("MY_TOKEN_A");
    const token_b = Symbol("MY_TOKEN_B");

    const token_a_value = "token_a_value";
    const token_b_value = "token_b_value";

    const token_a_provider = {
      useValue: token_a_value,
    };

    const token_b_provider = {
      useValue: token_b_value,
    };

    registry.assign(token_a, {
      provider: token_a_provider,
      scope: Scope.Singleton,
    });

    registry.assign(token_b, {
      provider: token_b_provider,
      scope: Scope.Singleton,
    });

    expect(registry.get(token_a)).toBeDefined();
    expect(registry.get(token_a)?.provider).toBe(token_a_provider);

    expect(registry.get(token_b)).toBeDefined();
    expect(registry.get(token_b)?.provider).toBe(token_b_provider);
  });
});
