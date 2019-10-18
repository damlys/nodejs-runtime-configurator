import { ConfigurationItemInterface } from "../Schema/ConfigurationItemInterface";
import { ConfigurationPrinterInterface } from "./ConfigurationPrinterInterface";
export declare class CommandLinePrinter implements ConfigurationPrinterInterface {
    private readonly tableWidth;
    constructor(tableWidth?: number);
    render(items: ConfigurationItemInterface[]): string;
    print(items: ConfigurationItemInterface[]): void;
}
