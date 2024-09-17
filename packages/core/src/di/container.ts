import { ProviderRegistry } from "./provider-registry";
import { Provider } from "./providers";
import { Instantiable, Scope, Token } from "./types";

/**
 * Implements an inversion-of-control container which can be used to instantiate
 * objects and their dependencies.
 */
export class Container {
  protected registry = new ProviderRegistry();

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
  ): void {}
}
