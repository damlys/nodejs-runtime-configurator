import { ConfigurationValidatorInterface } from "./ConfigurationValidatorInterface";
export declare class NumberValidator implements ConfigurationValidatorInterface {
    private readonly mustBeInteger;
    private readonly minimumValue;
    private readonly maximumValue;
    constructor(mustBeInteger?: boolean, minimumValue?: number, maximumValue?: number);
    validate(value: any): string[];
}
