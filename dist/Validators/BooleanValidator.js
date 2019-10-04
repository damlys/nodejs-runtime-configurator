"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BooleanValidator {
    validate(value) {
        if (typeof value !== "boolean") {
            return ["Value must be a boolean."];
        }
        return [];
    }
}
exports.BooleanValidator = BooleanValidator;
