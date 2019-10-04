import "jest";
import { ArrayValidator } from "../../src/Validators/ArrayValidator";
import { BooleanValidator } from "../../src/Validators/BooleanValidator";
import { ConfigurationValidatorInterface } from "../../src/Validators/ConfigurationValidatorInterface";
import { NumberValidator } from "../../src/Validators/NumberValidator";

test("should pass only arrays", () => {
    const validator: ConfigurationValidatorInterface = new ArrayValidator(
        new BooleanValidator(),
    );

    expect(validator.validate([true, false, true]))
        .toEqual([]);

    for (const value of [
        undefined,
        null,
        false,
        0,
        "",
        Symbol("whatever"),
        {},
    ]) {
        expect(validator.validate(value))
            .toEqual(["Value must be an array."]);
    }
});

test("should check minimum and maximum length", () => {
    const validator: ConfigurationValidatorInterface = new ArrayValidator(
        new BooleanValidator(),
        2,
        4,
    );

    expect(validator.validate([true]))
        .toEqual(["Array must have at least 2 items."]);
    expect(validator.validate([true, false]))
        .toEqual([]);
    expect(validator.validate([true, false, true, false]))
        .toEqual([]);
    expect(validator.validate([true, false, true, false, true]))
        .toEqual(["Array must have at most 4 items."]);
});

test("should return items errors", () => {
    const validator: ConfigurationValidatorInterface = new ArrayValidator(
        new NumberValidator(true, 0, 10),
        2,
        4,
    );

    expect(validator.validate([100]))
        .toEqual([
            "Array must have at least 2 items.",
            "[0] Value must be smaller than 10.",
        ]);
    expect(validator.validate([-1, 100]))
        .toEqual([
            "[0] Value must be bigger than 0.",
            "[1] Value must be smaller than 10.",
        ]);
    expect(validator.validate([-0.1, "a", 10.1]))
        .toEqual([
            "[0] Value must be an integer.",
            "[0] Value must be bigger than 0.",
            "[1] Value must be a number.",
            "[2] Value must be an integer.",
            "[2] Value must be smaller than 10.",
        ]);
});
