import "jest";
import { ConfigurationValidatorInterface } from "../../src/Validators/ConfigurationValidatorInterface";
import { StringValidator } from "../../src/Validators/StringValidator";

test("should pass only strings", () => {
    const validator: ConfigurationValidatorInterface = new StringValidator();

    expect(validator.validate(""))
        .toEqual([]);
    expect(validator.validate("whatever"))
        .toEqual([]);

    for (const value of [
        undefined,
        null,
        false,
        0,
        Symbol("whatever"),
        {},
        [],
    ]) {
        expect(validator.validate(value))
            .toEqual(["Value must be a string."]);
    }
});

test("should check minimum and maximum length", () => {
    const validator: ConfigurationValidatorInterface = new StringValidator(3, 10);

    expect(validator.validate("ab"))
        .toEqual(["Value must have at least 3 characters."]);
    expect(validator.validate("abc"))
        .toEqual([]);
    expect(validator.validate("abcdefghij"))
        .toEqual([]);
    expect(validator.validate("abcdefghijk"))
        .toEqual(["Value must have at most 10 characters."]);
});
