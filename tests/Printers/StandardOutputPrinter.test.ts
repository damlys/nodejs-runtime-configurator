import "jest";
import stripAnsi from "strip-ansi";
import { ConfigurationPrinterInterface } from "../../src/Printers/ConfigurationPrinterInterface";
import { StandardOutputPrinter } from "../../src/Printers/StandardOutputPrinter";
import { ConfigurationItem } from "../../src/Schema/ConfigurationItem";
import { ConfigurationItemInterface } from "../../src/Schema/ConfigurationItemInterface";

test("should be able to render a table", () => {
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
│ Key                    │ Description        │ Default value          │ Value                  │
├────────────────────────┼────────────────────┼────────────────────────┼────────────────────────┤
│ foo                    │ Foo.               │ 0                      │ 1                      │
├────────────────────────┼────────────────────┼────────────────────────┼────────────────────────┤
│ bar                    │ Bar.               │ [                      │ ~                      │
│                        │                    │   "whatever"           │                        │
│                        │                    │ ]                      │                        │
└────────────────────────┴────────────────────┴────────────────────────┴────────────────────────┘`,
    );
});

test("should print rendered table to the standard output", () => {
    const items: ConfigurationItemInterface[] = [
        new ConfigurationItem("foo", "Foo.", 0),
    ];

    const printer: ConfigurationPrinterInterface = new StandardOutputPrinter(100);
    printer.render = (i: ConfigurationItemInterface[]): string => {
        return "the-render-result";
    };

    const renderSpy: any = jest.spyOn(printer, "render");
    const logSpy: any = jest.spyOn(console, "log").mockImplementation();
    printer.print(items);
    expect(renderSpy).toBeCalledWith(items);
    expect(logSpy).toBeCalledWith("the-render-result");
    renderSpy.mockRestore();
    logSpy.mockRestore();
});
