import "jest";
import { ConfigurationValidatorError } from "../../src/Validators/ConfigurationValidatorError";
import { ConfigurationValidatorInterface } from "../../src/Validators/ConfigurationValidatorInterface";
import { EnumerableValidator } from "../../src/Validators/EnumerableValidator";

test("should check if values list is not empty", () => {
    expect(() => new EnumerableValidator([]))
        .toThrow(new ConfigurationValidatorError("Enumerable validator values can not be empty."));
});

test("should pass only listed values", () => {
    const allowedValues: any[] = [
        null,
        true,
        1,
        "foo",
    ];
    const validator: ConfigurationValidatorInterface = new EnumerableValidator(allowedValues);

    for (const value of allowedValues) {
        expect(validator.validate(value))
            .toEqual([]);
    }

    for (const value of [
        undefined,
        false,
        2,
        "bar",
        {},
        [],
    ]) {
        expect(validator.validate(value))
            .toEqual(['Value must equal one of the following: null, true, 1, "foo".']);
    }
});
