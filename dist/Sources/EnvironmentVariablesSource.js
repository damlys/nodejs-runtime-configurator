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
        const objects = [];
        for (const key in this.environmentVariables) {
            if (this.environmentVariables.hasOwnProperty(key)) {
                if (key === this.variableName) {
                    const value = utils_1.tryParseJson(this.environmentVariables[key]);
                    if (typeof value !== "object" || value === null || value instanceof Array) {
                        throw new ConfigurationSourceError_1.ConfigurationSourceError(`The "${this.variableName}" environment variable must contain an object.`);
                    }
                    objects.push(value);
                }
                else if (key.startsWith(this.variableName + "__")) {
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
