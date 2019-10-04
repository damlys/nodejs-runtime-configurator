import { ConfigurationItemInterface } from "../Schema/ConfigurationItemInterface";
export interface PrinterInterface {
    render(items: ConfigurationItemInterface[]): string;
    print(items: ConfigurationItemInterface[]): void;
}
