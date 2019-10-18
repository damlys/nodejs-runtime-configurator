import { ConfigurationValidatorInterface } from "./ConfigurationValidatorInterface";
export declare class RegularExpressionValidator implements ConfigurationValidatorInterface {
    private readonly regularExpression;
    constructor(regexp: RegExp);
    validate(value: any): string[];
}
