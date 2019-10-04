import { ConfigurationItemInterface } from "../Schema/ConfigurationItemInterface";
import { PrinterInterface } from "./PrinterInterface";
export declare class CommandLinePrinter implements PrinterInterface {
    private readonly tableWidth;
    constructor(tableWidth?: number);
    render(items: ConfigurationItemInterface[]): string;
    print(items: ConfigurationItemInterface[]): void;
}
