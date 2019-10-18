import "jest";
import { ConfigurationValidatorInterface } from "../../src/Validators/ConfigurationValidatorInterface";
import { RegularExpressionValidator } from "../../src/Validators/RegularExpressionValidator";

test("should pass only strings", () => {
    const validator: ConfigurationValidatorInterface = new RegularExpressionValidator(/.*/);

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

test("should test value with regular expression", () => {
    const primitiveEmailRegExp = /\S+@\S+\.\S+/;
    const emailValidator: ConfigurationValidatorInterface = new RegularExpressionValidator(primitiveEmailRegExp);

    expect(emailValidator.validate("abc"))
        .toEqual([`Value does not pass "${primitiveEmailRegExp.toString()}" test.`]);
    expect(emailValidator.validate("abc@abc.abc"))
        .toEqual([]);
});
