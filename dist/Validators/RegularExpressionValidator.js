"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RegularExpressionValidator {
    constructor(regexp) {
        this.regularExpression = regexp;
    }
    validate(value) {
        if (typeof value !== "string") {
            return ["Value must be a string."];
        }
        if (!this.regularExpression.test(value)) {
            return [`Value does not pass "${this.regularExpression.toString()}" test.`];
        }
        return [];
    }
}
exports.RegularExpressionValidator = RegularExpressionValidator;
