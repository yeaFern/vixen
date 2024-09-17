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
});
