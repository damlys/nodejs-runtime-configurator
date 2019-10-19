import "jest";
import { ConfigurationPrinterInterface } from "../../src/Printers/ConfigurationPrinterInterface";
import { ConfigurationBag } from "../../src/Schema/ConfigurationBag";
import { ConfigurationBagInterface } from "../../src/Schema/ConfigurationBagInterface";
import { ConfigurationItem } from "../../src/Schema/ConfigurationItem";
import { ConfigurationItemInterface } from "../../src/Schema/ConfigurationItemInterface";
import { ConfigurationSchemaError } from "../../src/Schema/ConfigurationSchemaError";
import { ConfigurationSourceInterface } from "../../src/Sources/ConfigurationSourceInterface";
import { BooleanValidator } from "../../src/Validators/BooleanValidator";
import { NumberValidator } from "../../src/Validators/NumberValidator";
import { StringValidator } from "../../src/Validators/StringValidator";

test("should fill in values with defaults and resolved object", () => {
    const configuration: ConfigurationBagInterface = new ConfigurationBag(
        [
            new ConfigurationItem("alpha.beta", "", 0, [new NumberValidator()]),
            new ConfigurationItem("gamma.delta", "", "whatever", [new StringValidator()]),
        ],
        [
            {
                resolve: (): object => {
                    return { alpha: { beta: 1 } };
                },
            },
        ],
    );

    expect(configuration.has("alpha.beta"))
        .toBe(true);
    expect(configuration.get("alpha.beta"))
        .toEqual(1);

    expect(configuration.has("gamma.delta"))
        .toBe(true);
    expect(configuration.get("gamma.delta"))
        .toBe("whatever");
});

test("should throw error if value does not exist", () => {
    const configuration: ConfigurationBagInterface = new ConfigurationBag(
        [
            new ConfigurationItem("alpha", "", true, [new BooleanValidator()]),
        ],
        [],
    );

    expect(configuration.has("beta"))
        .toBe(false);
    expect(() => configuration.get("beta"))
        .toThrow(new ConfigurationSchemaError('Configuration item "beta" does not exist.'));

    expect(configuration.has("gamma.delta"))
        .toBe(false);
    expect(() => configuration.get("gamma.delta"))
        .toThrow(new ConfigurationSchemaError('Configuration item "gamma.delta" does not exist.'));
});

test("should validate configuration items", () => {
    expect(() => {
        // tslint:disable-next-line:no-unused-expression
        new ConfigurationBag(
            [
                new ConfigurationItem("alpha", "", true, [new BooleanValidator()]),
                new ConfigurationItem("beta", "", 1, [new NumberValidator()]),
            ],
            [
                {
                    resolve: (): object => {
                        return { beta: null };
                    },
                },
            ],
        );
    }).toThrow(new ConfigurationSchemaError(
        `Some of configuration items are invalid:
"beta": Value must be a number.`,
    ));

    expect(() => {
        // tslint:disable-next-line:no-unused-expression
        new ConfigurationBag(
            [
                new ConfigurationItem("alpha", "", true, [new BooleanValidator()]),
                new ConfigurationItem("beta", "", 1, [new NumberValidator()]),
                new ConfigurationItem("gamma", "", "", [new StringValidator()]),
                new ConfigurationItem("delta", "", 0, [new NumberValidator()]),
            ],
            [
                {
                    resolve: (): object => {
                        return { beta: null, gamma: 1, delta: 1 };
                    },
                },
            ],
        );
    }).toThrow(new ConfigurationSchemaError(
        `Some of configuration items are invalid:
"beta": Value must be a number.
"gamma": Value must be a string.`,
    ));
});

test("should use printer to generate documentation", () => {
    const items: ConfigurationItemInterface[] = [
        new ConfigurationItem("foo", "Foo.", "foo content"),
    ];

    const sources: ConfigurationSourceInterface[] = [];

    const configurationBag: ConfigurationBagInterface = new ConfigurationBag(items, sources);

    const printer: ConfigurationPrinterInterface = {
        render(i: ConfigurationItemInterface[]): string {
            return "render result";
        },
        print(i: ConfigurationItemInterface[]): void {
            return;
        },
    };

    const renderSpy = jest.spyOn(printer, "render");
    expect(configurationBag.render(printer)).toBe("render result");
    expect(renderSpy).toBeCalledWith(items);
    renderSpy.mockRestore();

    const printSpy = jest.spyOn(printer, "print");
    configurationBag.print(printer);
    expect(printSpy).toBeCalledWith(items);
    printSpy.mockRestore();
});
