import { ConfigurationValidatorInterface } from "./ConfigurationValidatorInterface";
export declare class EnumerableValidator implements ConfigurationValidatorInterface {
    private readonly values;
    constructor(values: any[]);
    validate(value: any): string[];
    private stringifyValues;
}
