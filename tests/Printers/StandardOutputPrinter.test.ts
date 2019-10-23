import "jest";
import stripAnsi from "strip-ansi";
import { ConfigurationPrinterInterface } from "../../src/Printers/ConfigurationPrinterInterface";
import { StandardOutputPrinter } from "../../src/Printers/StandardOutputPrinter";
import { ConfigurationItem } from "../../src/Schema/ConfigurationItem";
import { ConfigurationItemInterface } from "../../src/Schema/ConfigurationItemInterface";

test("should be able to render table", () => {
    const items: ConfigurationItemInterface[] = [
        new ConfigurationItem("foo", "Foo.", 0),
        new ConfigurationItem("bar", "Bar.", ["whatever"]),
    ];
    items[0].setValue(1);

    const printer: ConfigurationPrinterInterface = new StandardOutputPrinter(97);

    expect(
        stripAnsi(
            printer.render(items),
        ),
    ).toBe(
        `┌────────────────────────┬────────────────────┬────────────────────────┬────────────────────────┐
│ Key                    │ Description        │ Value                  │ Default value          │
├────────────────────────┼────────────────────┼────────────────────────┼────────────────────────┤
│ foo                    │ Foo.               │ 1                      │ 0                      │
├────────────────────────┼────────────────────┼────────────────────────┼────────────────────────┤
│ bar                    │ Bar.               │ ~                      │ [                      │
│                        │                    │                        │   "whatever"           │
│                        │                    │                        │ ]                      │
└────────────────────────┴────────────────────┴────────────────────────┴────────────────────────┘`,
    );
});

test("should print rendered table to console", () => {
    const items: ConfigurationItemInterface[] = [
        new ConfigurationItem("foo", "Foo.", 0),
    ];

    const printer: ConfigurationPrinterInterface = new StandardOutputPrinter(100);
    printer.render = (i: ConfigurationItemInterface[]): string => {
        return "render result";
    };

    const renderSpy = jest.spyOn(printer, "render");
    const logSpy = jest.spyOn(console, "log").mockImplementation();
    printer.print(items);
    expect(renderSpy).toBeCalledWith(items);
    expect(logSpy).toBeCalledWith("render result");
    renderSpy.mockRestore();
    logSpy.mockRestore();
});
