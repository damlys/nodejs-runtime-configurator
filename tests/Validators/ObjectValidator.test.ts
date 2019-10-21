import "jest";
import { BooleanValidator } from "../../src/Validators/BooleanValidator";
import { ConfigurationValidatorInterface } from "../../src/Validators/ConfigurationValidatorInterface";
import { NumberValidator } from "../../src/Validators/NumberValidator";
import { ObjectValidator } from "../../src/Validators/ObjectValidator";

test("should pass only objects", () => {
    const validator: ConfigurationValidatorInterface = new ObjectValidator({
        alpha: new BooleanValidator(),
    });

    expect(validator.validate({ alpha: true }))
        .toEqual([]);

    for (const value of [
        undefined,
        null,
        false,
        0,
        "",
        Symbol("whatever"),
        [],
    ]) {
        expect(validator.validate(value))
            .toEqual(["Value must be an object."]);
    }
});

test("should return items errors", () => {
    const validator: ConfigurationValidatorInterface = new ObjectValidator({
        alpha: new BooleanValidator(),
        beta: new NumberValidator(true, 0, 10),
        gamma: undefined,
    });

    expect(validator.validate({ alpha: null, beta: 1, gamma: "whatever" }))
        .toEqual([
            '["alpha"] Value must be a boolean.',
        ]);
    expect(validator.validate({ alpha: null, beta: 11.1, ignore: "me" }))
        .toEqual([
            '["alpha"] Value must be a boolean.',
            '["beta"] Value must be an integer.',
            '["beta"] Value must be smaller than 10.',
        ]);
});
