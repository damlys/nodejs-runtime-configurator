"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NumberValidator {
    constructor(mustBeInteger = false, minimumValue, maximumValue) {
        this.mustBeInteger = mustBeInteger;
        this.minimumValue = minimumValue;
        this.maximumValue = maximumValue;
    }
    validate(value) {
        if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
            return ["Value must be a number."];
        }
        const errors = [];
        if (this.mustBeInteger && !Number.isInteger(value)) {
            errors.push("Value must be an integer.");
        }
        if (this.minimumValue !== undefined && value < this.minimumValue) {
            errors.push(`Value must be bigger than ${this.minimumValue}.`);
        }
        if (this.maximumValue !== undefined && value > this.maximumValue) {
            errors.push(`Value must be smaller than ${this.maximumValue}.`);
        }
        return errors;
    }
}
exports.NumberValidator = NumberValidator;
