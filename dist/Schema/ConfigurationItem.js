"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const deepFreeze = require("deep-freeze");
class ConfigurationItem {
    constructor(key, description, defaultValue, validators = []) {
        this.key = key;
        this.description = description;
        this.defaultValue = defaultValue;
        this.validators = validators;
        this.setValue(defaultValue);
    }
    getKey() {
        return this.key;
    }
    getDescription() {
        return this.description;
    }
    getDefaultValue() {
        return this.defaultValue;
    }
    setValue(value) {
        if (typeof value === "object" && value !== null) {
            deepFreeze(value);
        }
        this.value = value;
    }
    getValue() {
        return this.value;
    }
    validate(value) {
        const errors = [];
        for (const validator of this.validators) {
            validator
                .validate(value)
                .forEach((error) => {
                errors.push(error);
            });
        }
        return errors;
    }
}
exports.ConfigurationItem = ConfigurationItem;
