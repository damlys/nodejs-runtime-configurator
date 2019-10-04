import { PrinterInterface } from "../Printers/PrinterInterface";

export interface ConfigurationBagInterface {
    has(key: string): boolean;

    get(key: string): any;

    render(printer: PrinterInterface): string;

    print(printer: PrinterInterface): void;
}
