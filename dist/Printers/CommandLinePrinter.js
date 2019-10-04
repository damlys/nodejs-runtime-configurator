"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cliTable3 = require("cli-table3");
class CommandLinePrinter {
    constructor(tableWidth = process.stdout.columns) {
        this.tableWidth = tableWidth;
    }
    render(items) {
        const columnsCount = 4;
        const columnWidth = Math.floor(this.tableWidth / columnsCount);
        const restColumnWidth = this.tableWidth - columnsCount - 1 - (columnWidth * (columnsCount - 1));
        const table = new cliTable3({
            style: {
                head: ["bold"],
            },
            head: [
                "Key",
                "Description",
                "Value",
                "Default value",
            ],
            colWidths: [
                columnWidth,
                restColumnWidth,
                columnWidth,
                columnWidth,
            ],
            wordWrap: true,
        });
        for (const item of items) {
            const value = JSON.stringify(item.getValue(), null, 2);
            const defaultValue = JSON.stringify(item.getDefaultValue(), null, 2);
            table.push([
                item.getKey(),
                item.getDescription(),
                value === defaultValue ? "~" : value,
                defaultValue,
            ]);
        }
        return table.toString();
    }
    print(items) {
        // tslint:disable-next-line:no-console
        console.log(this.render(items));
    }
}
exports.CommandLinePrinter = CommandLinePrinter;
