import { CircularDependencyError, InvalidProviderError } from "./errors";
import {
  ProviderRegistry,
  type ProviderRegistryEntry,
} from "./provider-registry";
import {
  type ClassProvider,
  type Provider,
  isClassProvider,
  isFactoryProvider,
  isProvider,
  isValueProvider,
} from "./providers";
import {
  type Any,
  type Instantiable,
  type PropertyDependency,
  Scope,
  type Token,
} from "./types";
import { getPropertyMetadata } from "./utilities";

class ResolutionContext {
  private stack: Token[] = [];

  isResolved(token: Token): boolean {
    return this.stack.includes(token);
  }

  onResolved(token: Token): void {
    this.stack.push(token);
  }
}

/**
 * Implements an inversion-of-control container which can be used to instantiate
 * objects and their dependencies.
 */
export class Container {
  protected registry = new ProviderRegistry();

  constructor(private parent: Container | undefined = undefined) {}

  /**
   * Registers the given token to the given provider. Tokens must be registered
   * with the container before they can be resolved.
   *
   * @example
   * container.register(MyClass, { useClass: MyClass });
   * // Alternatively you can use the shorthand syntax for classes.
   * container.register(MyClass, MyClass);
   *
   * @param token
   *    The token to register.
   *
   * @param type
   *    The provider to bind to this token.
   *
   * @param scope
   *    The scope to use when resolving this token. Defaults to `Scope.Singleton`.
   *
   * @throws {DuplicateProviderTokenError} If the token is already registered with the container.
   */
  register<T>(
    token: Token<T>,
    type: Provider<T> | Instantiable<T>,
    scope: Scope = Scope.Singleton
  ): void {
    const provider: Provider<T> = isProvider(type)
      ? type
      : ({ useClass: type } satisfies ClassProvider<T>);

    this.registry.assign(token, {
      provider: provider,
      scope: scope,
    });
  }

  /**
   * Given a token, attempts to resolve it's depdencies (if needed) and return
   * a valid instance.
   *
   * @param token
   *    The token to resolve.
   *
   * @returns
   *    The instance of the given token.
   *
   * @throws {CircularDependencyError} If a circular dependency is found.
   * @throws {UnknownTokenError} If the given token is not registered in the container.
   */
  resolve<T>(token: Token<T>): T {
    return this.resolveInternal(token, new ResolutionContext());
  }

  private resolveInternal<T>(token: Token<T>, context: ResolutionContext): T {
    if (this.parent !== undefined) {
      if (!this.registry.has(token)) {
        return this.parent.resolveInternal(token, context);
      }
    }

    if (context.isResolved(token)) {
      throw new CircularDependencyError();
    }
    context.onResolved(token);

    const entry = this.registry.get(token);

    if (isClassProvider(entry.provider)) {
      return entry.scope === Scope.Singleton
        ? entry.instance ||
            // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
            (entry.instance = this.instantiate(
              entry.provider.useClass,
              context
            ))
        : this.instantiate(entry.provider.useClass, context);
    }

    if (isFactoryProvider(entry.provider)) {
      return entry.scope === Scope.Singleton
        ? entry.instance ||
            // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
            (entry.instance = entry.provider.useFactory(
              ...(entry.provider.inject ?? []).map((token) =>
                this.resolveInternal(token, context)
              )
            ))
        : entry.provider.useFactory(
            ...(entry.provider.inject ?? []).map((token) =>
              this.resolveInternal(token, context)
            )
          );
    }

    if (isValueProvider(entry.provider)) {
      return entry.provider.useValue;
    }

    throw new InvalidProviderError();
  }

  private instantiate<T>(
    token: Instantiable<T>,
    context: ResolutionContext
  ): T {
    let all_properties: PropertyDependency[] = [];

    let current = token;
    do {
      all_properties = all_properties.concat(getPropertyMetadata(current));

      current = Object.getPrototypeOf(current);
    } while (current !== Function.prototype && current !== Object.prototype);

    const instance = new token();
    for (const dependency of all_properties) {
      (instance as Any)[dependency.property] = this.resolveInternal(
        dependency.token,
        context
      );
    }

    return instance;
  }

  fork(): Container {
    return new Container(this);
  }
}
