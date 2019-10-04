"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringValidator {
    constructor(minimumLength, maximumLength) {
        this.minimumLength = minimumLength;
        this.maximumLength = maximumLength;
    }
    validate(value) {
        if (typeof value !== "string") {
            return ["Value must be a string."];
        }
        const errors = [];
        if (this.minimumLength !== undefined && value.length < this.minimumLength) {
            errors.push(`Value must have at least ${this.minimumLength} characters.`);
        }
        if (this.maximumLength !== undefined && value.length > this.maximumLength) {
            errors.push(`Value must have at most ${this.maximumLength} characters.`);
        }
        return errors;
    }
}
exports.StringValidator = StringValidator;
