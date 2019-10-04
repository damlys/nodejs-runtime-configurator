import { PrinterInterface } from "../Printers/PrinterInterface";
import { ConfigurationSourceInterface } from "../Sources/ConfigurationSourceInterface";
import { ConfigurationBagInterface } from "./ConfigurationBagInterface";
import { ConfigurationItemInterface } from "./ConfigurationItemInterface";
export declare class ConfigurationBag implements ConfigurationBagInterface {
    private readonly items;
    constructor(items: ConfigurationItemInterface[], sources: ConfigurationSourceInterface[]);
    has(key: string): boolean;
    get(key: string): any;
    render(printer: PrinterInterface): string;
    print(printer: PrinterInterface): void;
    private find;
}
