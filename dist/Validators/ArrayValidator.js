"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArrayValidator {
    constructor(validator, minimumLength, maximumLength) {
        this.validator = validator;
        this.minimumLength = minimumLength;
        this.maximumLength = maximumLength;
    }
    validate(values) {
        if (!(values instanceof Array)) {
            return ["Value must be an array."];
        }
        const errors = [];
        if (this.minimumLength !== undefined && values.length < this.minimumLength) {
            errors.push(`Array must have at least ${this.minimumLength} items.`);
        }
        if (this.maximumLength !== undefined && values.length > this.maximumLength) {
            errors.push(`Array must have at most ${this.maximumLength} items.`);
        }
        for (let i = 0; i < values.length; i++) {
            this.validator
                .validate(values[i])
                .forEach((error) => {
                errors.push(`[${i}] ${error}`);
            });
        }
        return errors;
    }
}
exports.ArrayValidator = ArrayValidator;
