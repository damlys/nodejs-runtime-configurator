"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelCase = require("camelcase");
// @ts-ignore
const mixin = require("mixin-deep");
const utils_1 = require("../utils");
const ConfigurationSourceError_1 = require("./ConfigurationSourceError");
class EnvironmentVariablesSource {
    constructor(variableName = "APP", environmentVariables = process.env) {
        if (variableName === "") {
            throw new ConfigurationSourceError_1.ConfigurationSourceError("The environment variable name can not be empty.");
        }
        this.variableName = variableName;
        this.environmentVariables = environmentVariables;
    }
    resolve() {
        return mixin({}, ...Object
            .entries(this.environmentVariables)
            .filter(([key, value]) => {
            return key === this.variableName || key.startsWith(this.variableName + "__");
        })
            .map(([key, value]) => {
            if (key === this.variableName) {
                const jsonValue = utils_1.tryParseJson(value);
                if (typeof jsonValue === "object" && jsonValue !== null && !(jsonValue instanceof Array)) {
                    return jsonValue;
                }
                throw new ConfigurationSourceError_1.ConfigurationSourceError(`The "${this.variableName}" environment variable must contain an object.`);
            }
            return utils_1.createObjectByPathAndValue(this.keyToPath(key), utils_1.tryParseJson(value));
        }));
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
