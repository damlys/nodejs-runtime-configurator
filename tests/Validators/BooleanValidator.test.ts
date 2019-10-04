import "jest";
import { BooleanValidator } from "../../src/Validators/BooleanValidator";
import { ConfigurationValidatorInterface } from "../../src/Validators/ConfigurationValidatorInterface";

test("should pass only booleans", () => {
    const validator: ConfigurationValidatorInterface = new BooleanValidator();

    expect(validator.validate(false))
        .toEqual([]);
    expect(validator.validate(true))
        .toEqual([]);

    for (const value of [
        undefined,
        null,
        0,
        "true",
        Symbol("whatever"),
        {},
        [],
    ]) {
        expect(validator.validate(value))
            .toEqual(["Value must be a boolean."]);
    }
});
