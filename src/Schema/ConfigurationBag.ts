import { ConfigurationPrinterInterface } from "../Printers/ConfigurationPrinterInterface";
import { ConfigurationSourceInterface } from "../Sources/ConfigurationSourceInterface";
import { SourcesAggregator } from "../Sources/SourcesAggregator";
import { getFromObjectByPath } from "../utils";
import { ConfigurationBagInterface } from "./ConfigurationBagInterface";
import { ConfigurationItemInterface } from "./ConfigurationItemInterface";
import { ConfigurationSchemaError } from "./ConfigurationSchemaError";

export class ConfigurationBag implements ConfigurationBagInterface {
    private readonly items: ConfigurationItemInterface[];

    public constructor(
        items: ConfigurationItemInterface[],
        sources: ConfigurationSourceInterface[],
    ) {
        this.items = items;

        const resolvedObject: object = (new SourcesAggregator(sources)).resolve();

        const errors: string[] = [];
        for (const item of this.items) {
            const value: any = getFromObjectByPath(
                resolvedObject,
                item.getKey().split("."),
            );
            if (value === undefined) {
                continue;
            }
            item
                .validate(value)
                .forEach((error: string): void => {
                    errors.push(`"${item.getKey()}": ${error}`);
                });
            item.setValue(value);
        }
        if (errors.length !== 0) {
            throw new ConfigurationSchemaError(`Some of configuration items are invalid:\n${errors.join("\n")}`);
        }
    }

    public has(key: string): boolean {
        return this.find(key) !== undefined;
    }

    public get(key: string): any {
        const item: ConfigurationItemInterface | undefined = this.find(key);
        if (item === undefined) {
            throw new ConfigurationSchemaError(`Configuration item "${key}" does not exist.`);
        }
        return item.getValue();
    }

    public render(printer: ConfigurationPrinterInterface): string {
        return printer.render(this.items);
    }

    public print(printer: ConfigurationPrinterInterface): void {
        return printer.print(this.items);
    }

    private find(key: string): ConfigurationItemInterface | undefined {
        return this.items.find((item: ConfigurationItemInterface): boolean => {
            return item.getKey() === key;
        });
    }
}
