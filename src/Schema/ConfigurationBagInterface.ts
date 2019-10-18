import { ConfigurationPrinterInterface } from "../Printers/ConfigurationPrinterInterface";

export interface ConfigurationBagInterface {
    has(key: string): boolean;

    get(key: string): any;

    render(printer: ConfigurationPrinterInterface): string;

    print(printer: ConfigurationPrinterInterface): void;
}
