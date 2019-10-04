import { ConfigurationValidatorInterface } from "./ConfigurationValidatorInterface";
export declare class StringValidator implements ConfigurationValidatorInterface {
    private readonly minimumLength;
    private readonly maximumLength;
    constructor(minimumLength?: number, maximumLength?: number);
    validate(value: any): string[];
}
