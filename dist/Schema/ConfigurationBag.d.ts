import { ConfigurationPrinterInterface } from "../Printers/ConfigurationPrinterInterface";
import { ConfigurationSourceInterface } from "../Sources/ConfigurationSourceInterface";
import { ConfigurationBagInterface } from "./ConfigurationBagInterface";
import { ConfigurationItemInterface } from "./ConfigurationItemInterface";
export declare class ConfigurationBag implements ConfigurationBagInterface {
    private readonly items;
    constructor(items: ConfigurationItemInterface[], sources: ConfigurationSourceInterface[]);
    has(key: string): boolean;
    get(key: string): any;
    render(printer: ConfigurationPrinterInterface): string;
    print(printer: ConfigurationPrinterInterface): void;
    private find;
}
