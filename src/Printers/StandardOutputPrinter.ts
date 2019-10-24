import cliTable3 from "cli-table3";
import { ConfigurationItemInterface } from "../Schema/ConfigurationItemInterface";
import { ConfigurationPrinterInterface } from "./ConfigurationPrinterInterface";

export class StandardOutputPrinter implements ConfigurationPrinterInterface {
    private readonly tableWidth: number;

    public constructor(tableWidth: number) {
        this.tableWidth = tableWidth;
    }

    public render(items: ConfigurationItemInterface[]): string {
        const columnsCount: number = 4;
        const columnWidth: number = Math.floor(this.tableWidth / columnsCount);
        const restColumnWidth: number = this.tableWidth - columnsCount - 1 - (columnWidth * (columnsCount - 1));

        const table: cliTable3.Table = new cliTable3({
            style: {
                head: ["bold"],
            },
            head: [
                "Key",
                "Description",
                "Default value",
                "Value",
            ],
            colWidths: [
                columnWidth,
                restColumnWidth,
                columnWidth,
                columnWidth,
            ],
            wordWrap: true,
        }) as cliTable3.HorizontalTable;

        for (const item of items) {
            const defaultValue: string = JSON.stringify(item.getDefaultValue(), null, 2);
            const value: string = JSON.stringify(item.getValue(), null, 2);
            table.push([
                item.getKey(),
                item.getDescription(),
                defaultValue,
                value === defaultValue ? "~" : value,
            ]);
        }

        return table.toString();
    }

    public print(items: ConfigurationItemInterface[]): void {
        // tslint:disable-next-line:no-console
        console.log(this.render(items));
    }
}
