"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigurationValidatorError_1 = require("./ConfigurationValidatorError");
class EnumerableValidator {
    constructor(values) {
        if (values.length === 0) {
            throw new ConfigurationValidatorError_1.ConfigurationValidatorError("Enumerable validator values can not be empty.");
        }
        this.values = values;
    }
    validate(value) {
        if (!this.values.includes(value)) {
            return [`Value must equal one of the following: ${this.stringifyValues()}.`];
        }
        return [];
    }
    stringifyValues() {
        return this.values
            .map((value) => JSON.stringify(value))
            .join(", ");
    }
}
exports.EnumerableValidator = EnumerableValidator;
