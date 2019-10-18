import { ConfigurationItemInterface } from "../Schema/ConfigurationItemInterface";

export interface ConfigurationPrinterInterface {
    render(items: ConfigurationItemInterface[]): string;

    print(items: ConfigurationItemInterface[]): void;
}
