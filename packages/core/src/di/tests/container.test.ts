import { Container } from "../container";
import { Inject } from "../decorators";
import { CircularDependencyError, UnknownTokenError } from "../errors";
import { Scope } from "../types";

describe("Container", () => {
  it("can resolve a value", () => {
    const container = new Container();

    const value = 1234;
    const token = Symbol("MY_TOKEN");

    container.register(token, { useValue: value });

    expect(container.resolve(token)).toBe(value);
  });

  it("can resolve a transient class", () => {
    const container = new Container();

    // We use this silly counter hack instead of a mocked function because the
    // container cannot properly get the property metadata for a mock function.
    // Should probably work out how to do that.
    let counter = 0;
    class Example {
      constructor() {
        counter += 1;
      }
    }

    container.register(Example, { useClass: Example }, Scope.Transient);

    const instance_1 = container.resolve(Example);
    const instance_2 = container.resolve(Example);

    expect(instance_1).toBeDefined();
    expect(instance_2).toBeDefined();

    expect(instance_1).not.toBe(instance_2);

    expect(counter).toBe(2);
  });

  it("can resolve a singleton class", () => {
    const container = new Container();

    // We use this silly counter hack instead of a mocked function because the
    // container cannot properly get the property metadata for a mock function.
    // Should probably work out how to do that.
    let counter = 0;
    class Example {
      constructor() {
        counter += 1;
      }
    }

    container.register(Example, { useClass: Example }, Scope.Singleton);

    const instance_1 = container.resolve(Example);
    const instance_2 = container.resolve(Example);

    expect(instance_1).toBeDefined();
    expect(instance_2).toBeDefined();

    expect(instance_1).toBe(instance_2);

    expect(counter).toBe(1);
  });

  it("can resolve a transient factory", () => {
    const container = new Container();

    const value = 1234;

    const exampleFactory = jest.fn(() => value);

    const token = Symbol("MY_TOKEN");

    container.register(token, { useFactory: exampleFactory }, Scope.Transient);

    expect(container.resolve(token)).toBe(value);
    expect(container.resolve(token)).toBe(value);
    expect(container.resolve(token)).toBe(value);

    expect(exampleFactory).toHaveBeenCalledTimes(3);
  });

  it("can resolve a singleton factory", () => {
    const container = new Container();

    const value = 1234;

    const exampleFactory = jest.fn(() => value);

    const token = Symbol("MY_TOKEN");

    container.register(token, { useFactory: exampleFactory }, Scope.Singleton);

    expect(container.resolve(token)).toBe(value);
    expect(container.resolve(token)).toBe(value);
    expect(container.resolve(token)).toBe(value);

    expect(exampleFactory).toHaveBeenCalledTimes(1);
  });

  it("can resolve dependencies of a class", () => {
    const token = Symbol("injected_property");
    const expected_value = 1234;

    class Example {
      @Inject(token)
      public readonly injected_property!: number;
    }

    const container = new Container();
    container.register(token, { useValue: expected_value });
    container.register(Example, Example);

    const resolved = container.resolve(Example);

    expect(resolved.injected_property).toBeDefined();
    expect(resolved.injected_property).toBe(expected_value);
  });

  it("can resolve dependencies of a factory provider", () => {
    const container = new Container();

    const factory_token = Symbol("SOME_FACTORY");

    const v1_token = Symbol("V1_TOKEN");
    const v2_token = Symbol("V2_TOKEN");

    const v1 = 123456;
    const v2 = "Hello, world!";

    const factory_function = jest.fn((v1: number, v2: string) => ({ v1, v2 }));

    container.register(factory_token, {
      inject: [v1_token, v2_token],
      useFactory: factory_function,
    });

    container.register(v1_token, { useValue: v1 });
    container.register(v2_token, { useValue: v2 });

    expect(container.resolve(factory_token)).toStrictEqual({ v1, v2 });
    expect(factory_function).toHaveBeenCalledWith(v1, v2);
  });

  it("can detect circular dependencies", () => {
    // +---------+
    // |         |
    // v         |
    // A -> B -> C

    const token_a = Symbol("injected_property_a");
    const token_b = Symbol("injected_property_b");
    const token_c = Symbol("injected_property_c");

    class ExampleC {
      @Inject(token_a)
      // biome-ignore lint/suspicious/noExplicitAny:
      public readonly injected_property!: any;
    }

    class ExampleB {
      @Inject(token_c)
      // biome-ignore lint/suspicious/noExplicitAny:
      public readonly injected_property!: any;
    }

    class ExampleA {
      @Inject(token_b)
      // biome-ignore lint/suspicious/noExplicitAny:
      public readonly injected_property!: any;
    }

    const container = new Container();

    container.register(token_a, ExampleA);
    container.register(token_b, ExampleB);
    container.register(token_c, ExampleC);

    expect(() => container.resolve(token_a)).toThrow(CircularDependencyError);
    expect(() => container.resolve(token_b)).toThrow(CircularDependencyError);
    expect(() => container.resolve(token_c)).toThrow(CircularDependencyError);
  });

  it("can be forked", () => {
    const container_a = new Container();
    const container_b = container_a.fork();

    const value_a = 1234;
    const value_b = 5678;
    const value_c = 4321;
    const value_d = 8765;

    const token_1 = Symbol("MY_TOKEN_1");
    const token_2 = Symbol("MY_TOKEN_2");
    const token_3 = Symbol("MY_TOKEN_3");

    container_a.register(token_3, { useValue: value_d });
    container_a.register(token_1, { useValue: value_a });

    container_b.register(token_1, { useValue: value_b });
    container_b.register(token_2, { useValue: value_c });

    expect(container_a.resolve(token_1)).toBe(value_a);
    expect(container_b.resolve(token_1)).toBe(value_b);
    expect(container_b.resolve(token_2)).toBe(value_c);
    expect(container_b.resolve(token_3)).toBe(value_d);

    expect(() => container_a.resolve(token_2)).toThrow(UnknownTokenError);
  });
});
