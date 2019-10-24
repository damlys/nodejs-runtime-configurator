import "jest";
import { ConfigurationValidatorInterface } from "../../src/Validators/ConfigurationValidatorInterface";
import { NumberValidator } from "../../src/Validators/NumberValidator";

test("should pass only numbers", () => {
    const validator: ConfigurationValidatorInterface = new NumberValidator();

    expect(validator.validate(0))
        .toEqual([]);
    expect(validator.validate(-123.45))
        .toEqual([]);

    for (const value of [
        NaN,
        Infinity,
        -Infinity,
        undefined,
        null,
        false,
        "123",
        Symbol("whatever"),
        {},
        [],
    ]) {
        expect(validator.validate(value))
            .toEqual(["Value must be a number."]);
    }
});

test("should check if is an integer", () => {
    const validator: ConfigurationValidatorInterface = new NumberValidator(true);

    expect(validator.validate(-1.1))
        .toEqual(["Value must be an integer."]);
    expect(validator.validate(-1))
        .toEqual([]);
    expect(validator.validate(0))
        .toEqual([]);
    expect(validator.validate(1))
        .toEqual([]);
    expect(validator.validate(1.1))
        .toEqual(["Value must be an integer."]);
});

test("should check minimum and maximum value", () => {
    const validator: ConfigurationValidatorInterface = new NumberValidator(false, -100.1, 100.1);

    expect(validator.validate(-100.2))
        .toEqual(["Value must be bigger than -100.1."]);
    expect(validator.validate(-100.1))
        .toEqual([]);
    expect(validator.validate(-100))
        .toEqual([]);
    expect(validator.validate(-99.9))
        .toEqual([]);
    expect(validator.validate(0))
        .toEqual([]);
    expect(validator.validate(99.9))
        .toEqual([]);
    expect(validator.validate(100))
        .toEqual([]);
    expect(validator.validate(100.1))
        .toEqual([]);
    expect(validator.validate(100.2))
        .toEqual(["Value must be smaller than 100.1."]);
});
