import type { Any, PropertyDependency } from "./types";

export const PROPERTY_METADATA_KEY = Symbol("@vixen/core:property-metadata");

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export const getPropertyMetadata = (token: Function) => {
  return Object.prototype.hasOwnProperty.call(token, PROPERTY_METADATA_KEY)
    ? ((token as Any)[PROPERTY_METADATA_KEY] as PropertyDependency[])
    : [];
};

export const setPropertyMetadata = (
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  token: Function,
  metadata: PropertyDependency<Any>[]
) => {
  (token as Any)[PROPERTY_METADATA_KEY] = metadata;
};
