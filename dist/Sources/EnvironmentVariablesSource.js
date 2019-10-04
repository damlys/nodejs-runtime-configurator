"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelCase = require("camelcase");
// @ts-ignore
const mixin = require("mixin-deep");
const utils_1 = require("../utils");
const ConfigurationSourceError_1 = require("./ConfigurationSourceError");
class EnvironmentVariablesSource {
    constructor(variablesNamePrefix = "APP", environmentVariables = process.env) {
        if (variablesNamePrefix === "") {
            throw new ConfigurationSourceError_1.ConfigurationSourceError("The environment variables name prefix can not be empty.");
        }
        this.variablesNamePrefix = variablesNamePrefix;
        this.environmentVariables = environmentVariables;
    }
    resolve() {
        const objects = [];
        for (const key in this.environmentVariables) {
            if (this.environmentVariables.hasOwnProperty(key)) {
                if (key.startsWith(this.variablesNamePrefix + "__")) {
                    objects.push(utils_1.createObjectByPathAndValue(this.keyToPath(key), utils_1.tryParseJson(this.environmentVariables[key])));
                }
            }
        }
        return mixin({}, ...objects);
    }
    keyToPath(key) {
        const path = key
            .split(/_{2,}/)
            .map((value) => camelCase(value));
        path.shift();
        return path;
    }
}
exports.EnvironmentVariablesSource = EnvironmentVariablesSource;
