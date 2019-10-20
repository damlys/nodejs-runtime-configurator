"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ObjectValidator {
    constructor(validators) {
        this.validators = validators;
    }
    validate(object) {
        if (typeof object !== "object" || object === null || object instanceof Array) {
            return ["Value must be an object."];
        }
        const errors = [];
        Object
            .entries(this.validators)
            .forEach(([key, validator]) => {
            if (validator === undefined) {
                return;
            }
            validator
                .validate(object[key])
                .forEach((error) => {
                errors.push(`["${key}"] ${error}`);
            });
        });
        return errors;
    }
}
exports.ObjectValidator = ObjectValidator;
