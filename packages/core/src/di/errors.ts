import { type Token, isConstructorToken } from "./types";

export class DuplicateProviderTokenError extends Error {
  constructor(token: Token) {
    super(
      `A provider entry already exists for '${
        isConstructorToken(token) ? token.name : String(token)
      }'.`
    );
  }
}

export class DuplicateSingletonInstanceError extends Error {
  constructor(token: Token) {
    super(
      `A singleton instance already exists for '${
        isConstructorToken(token) ? token.name : String(token)
      }'.`
    );
  }
}

export class UnknownTokenError extends Error {
  constructor(token: Token) {
    super(
      `Token '${
        isConstructorToken(token) ? token.name : String(token)
      }' has not been registered with the container.`
    );
  }
}

export class InvalidProviderError extends Error {
  constructor() {
    super("The given provider was invalid.");
  }
}

export class ConstructorInjectionNotImplementedError extends Error {
  // biome-ignore lint/complexity/noBannedTypes: We want Function here.
  constructor(token: Function) {
    super(
      `Constructor injection is not implemented, please use property injection (for '${token.name}').`
    );
  }
}

export class CircularDependencyError extends Error {
  constructor() {
    super("Circular depdency detected.");
  }
}
