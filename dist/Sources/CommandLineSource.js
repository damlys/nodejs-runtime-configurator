"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelCase = require("camelcase");
const minimist = require("minimist");
// @ts-ignore
const mixin = require("mixin-deep");
const utils_1 = require("../utils");
const ConfigurationSourceError_1 = require("./ConfigurationSourceError");
class CommandLineSource {
    constructor(argumentName = "override", commandLineArguments = process.argv) {
        if (argumentName === "") {
            throw new ConfigurationSourceError_1.ConfigurationSourceError("The command line argument name can not be empty.");
        }
        this.argumentName = argumentName;
        this.commandLineArguments = commandLineArguments;
    }
    resolve() {
        const argv = minimist(this.commandLineArguments, { string: this.argumentName });
        if (argv[this.argumentName] === undefined) {
            return {};
        }
        let values;
        if (argv[this.argumentName] instanceof Array) {
            values = argv[this.argumentName];
        }
        else {
            values = [argv[this.argumentName]];
        }
        return mixin({}, ...values.map((value) => {
            if (value === "") {
                throw new ConfigurationSourceError_1.ConfigurationSourceError(`One or more "--${this.argumentName}" command line arguments does not define configuration item name.`);
            }
            const jsonValue = utils_1.tryParseJson(value);
            if (typeof jsonValue === "object" && jsonValue !== null && !(jsonValue instanceof Array)) {
                return jsonValue;
            }
            const index = value.indexOf("=");
            if (index === -1) {
                throw new ConfigurationSourceError_1.ConfigurationSourceError(`One or more "--${this.argumentName}" command line arguments does not define configuration item value.`);
            }
            return utils_1.createObjectByPathAndValue(this.keyToPath(value.substr(0, index)), utils_1.tryParseJson(value.substr(index + 1)));
        }));
    }
    keyToPath(key) {
        return key
            .split(/\.{1,}/)
            .map((value) => camelCase(value));
    }
}
exports.CommandLineSource = CommandLineSource;
