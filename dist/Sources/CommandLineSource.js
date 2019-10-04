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
        const args = minimist(this.commandLineArguments, { string: this.argumentName });
        if (args[this.argumentName] === undefined) {
            return {};
        }
        let overrides;
        if (args[this.argumentName] instanceof Array) {
            overrides = args[this.argumentName];
        }
        else {
            overrides = [args[this.argumentName]];
        }
        return mixin({}, ...overrides.map((override) => {
            if (override === "") {
                return {};
            }
            const index = override.indexOf("=");
            if (index === -1) {
                return {};
            }
            return utils_1.createObjectByPathAndValue(this.keyToPath(override.substr(0, index)), utils_1.tryParseJson(override.substr(index + 1)));
        }));
    }
    keyToPath(key) {
        return key
            .split(/\.{1,}/)
            .map((value) => camelCase(value));
    }
}
exports.CommandLineSource = CommandLineSource;
