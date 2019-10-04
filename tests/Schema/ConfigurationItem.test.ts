import "jest";
import { ConfigurationItem } from "../../src/Schema/ConfigurationItem";
import { ConfigurationItemInterface } from "../../src/Schema/ConfigurationItemInterface";
import { NumberValidator } from "../../src/Validators/NumberValidator";

test("should be able to set and get item details", () => {
    const item: ConfigurationItemInterface = new ConfigurationItem(
        "db.host",
        "Database host.",
        "localhost",
    );

    expect(item.getKey())
        .toBe("db.host");
    expect(item.getDescription())
        .toBe("Database host.");
    expect(item.getDefaultValue())
        .toBe("localhost");

    expect(item.getValue())
        .toBe("localhost");
    item.setValue("127.0.0.1");
    expect(item.getValue())
        .toBe("127.0.0.1");
});

test("should be able to validate value", () => {
    const item: ConfigurationItemInterface = new ConfigurationItem(
        "foo",
        "bar",
        "baz",
        [
            new NumberValidator(true, 0, 10),
            new NumberValidator(true, 0, 100),
        ],
    );

    expect(item.validate("whatever"))
        .toEqual([
            "Value must be a number.",
            "Value must be a number.",
        ]);
    expect(item.validate(100.1))
        .toEqual([
            "Value must be an integer.",
            "Value must be smaller than 10.",
            "Value must be an integer.",
            "Value must be smaller than 100.",
        ]);
});

test("should freeze values", () => {
    const itemWithObject: ConfigurationItemInterface = new ConfigurationItem(
        "foo",
        "Foo.",
        { alpha: { beta: 1 } },
    );
    const obj: any = itemWithObject.getValue();

    expect(() => {
        obj.alpha = 2;
    }).toThrow();
    expect(() => {
        obj.alpha.beta = 2;
    }).toThrow();
    expect(() => {
        delete obj.alpha.beta;
    }).toThrow();
    expect(() => {
        obj.gamma = 2;
    }).toThrow();

    const itemWithArray: ConfigurationItemInterface = new ConfigurationItem(
        "bar",
        "Bar.",
        [1, 2, 3],
    );
    const arr: any = itemWithArray.getValue();

    expect(() => {
        arr[0] = 2;
    }).toThrow();
    expect(() => {
        delete arr[1];
    }).toThrow();
    expect(() => {
        arr.length = 1;
    }).toThrow();
    expect(() => {
        arr.push(4);
    }).toThrow();
});
