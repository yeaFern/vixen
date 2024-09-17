import { Token, isConstructorToken } from "./types.js";

export class DuplicateProviderTokenError extends Error {
  constructor(token: Token<any>) {
    super(
      `A provider entry already exists for '${isConstructorToken(token) ? token.name : String(token)}'.`
    );
  }
}

export class UnknownTokenError extends Error {
  constructor(token: Token<any>) {
    super(
      `Token '${isConstructorToken(token) ? token.name : String(token)}' has not been registered with the container.`
    );
  }
}

export class InvalidProviderError extends Error {
  constructor() {
    super(`The given provider was invalid.`);
  }
}

export class ConstructorInjectionNotImplementedError extends Error {
  constructor(token: Function) {
    super(
      `Constructor injection is not implemented, please use property injection (for '${token.name}').`
    );
  }
}
