import "reflect-metadata";

import { ConstructorInjectionNotImplementedError } from "./errors";
import type { Any, PropertyDependency, Token } from "./types";
import { getPropertyMetadata, setPropertyMetadata } from "./utilities";

export const Injectable = (): ClassDecorator => {
  return (target) => {
    const params =
      (Reflect.getMetadata("design:paramtypes", target) as Any[]) ?? [];

    if (params.length > 0) {
      throw new ConstructorInjectionNotImplementedError(target);
    }
  };
};

export const Inject = (token?: Token): PropertyDecorator => {
  return (target, property) => {
    const type = token
      ? token
      : Reflect.getMetadata("design:type", target, property);

    const metadata = getPropertyMetadata(target.constructor);

    metadata.push({
      token: type,
      property: property,
    } satisfies PropertyDependency);

    setPropertyMetadata(target.constructor, metadata);
  };
};
