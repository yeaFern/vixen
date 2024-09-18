import { ConstructorInjectionNotImplementedError } from "../errors";
import { Inject, Injectable } from "./../decorators";
import type { PropertyDependency } from "./../types";
import { getPropertyMetadata } from "./../utilities";

describe("Injectable", () => {
  it("doesnt throw when a class has no constructor arguments", () => {
    expect(() => {
      @Injectable()
      class Example {
        constructor() {}
      }
    }).not.toThrow();
  });

  it("throws when a class has constructor arguments", () => {
    expect(() => {
      @Injectable()
      class Example {
        constructor(shouldnt_be_here: number) {}
      }
    }).toThrow(ConstructorInjectionNotImplementedError);
  });
});

describe("Inject", () => {
  it("properly attaches metadata to a class for multiple properties", () => {
    class Example {
      @Inject()
      protected readonly injected_property_1!: number;

      @Inject()
      protected readonly injected_property_2!: number;
    }

    expect(getPropertyMetadata(Example)).toHaveLength(2);
    expect(getPropertyMetadata(Example)).toContainEqual({
      token: Number,
      property: "injected_property_1",
    });
    expect(getPropertyMetadata(Example)).toContainEqual({
      token: Number,
      property: "injected_property_2",
    });
  });
});
