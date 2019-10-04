"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SourcesAggregator_1 = require("../Sources/SourcesAggregator");
const utils_1 = require("../utils");
const ConfigurationSchemaError_1 = require("./ConfigurationSchemaError");
class ConfigurationBag {
    constructor(items, sources) {
        this.items = items;
        const resolvedObject = (new SourcesAggregator_1.SourcesAggregator(sources)).resolve();
        const errors = [];
        for (const item of this.items) {
            const value = utils_1.getFromObjectByPath(resolvedObject, item.getKey().split("."));
            if (value === undefined) {
                continue;
            }
            item
                .validate(value)
                .forEach((error) => {
                errors.push(`"${item.getKey()}": ${error}`);
            });
            item.setValue(value);
        }
        if (errors.length !== 0) {
            throw new ConfigurationSchemaError_1.ConfigurationSchemaError(`Some of configuration items are invalid:\n${errors.join("\n")}`);
        }
    }
    has(key) {
        return this.find(key) !== undefined;
    }
    get(key) {
        const item = this.find(key);
        if (item === undefined) {
            throw new ConfigurationSchemaError_1.ConfigurationSchemaError(`Configuration item "${key}" does not exist.`);
        }
        return item.getValue();
    }
    render(printer) {
        return printer.render(this.items);
    }
    print(printer) {
        return printer.print(this.items);
    }
    find(key) {
        return this.items.find((item) => {
            return item.getKey() === key;
        });
    }
}
exports.ConfigurationBag = ConfigurationBag;
