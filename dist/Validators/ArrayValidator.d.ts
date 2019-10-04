import { ConfigurationValidatorInterface } from "./ConfigurationValidatorInterface";
export declare class ArrayValidator implements ConfigurationValidatorInterface {
    private readonly validator;
    private readonly minimumLength;
    private readonly maximumLength;
    constructor(validator: ConfigurationValidatorInterface, minimumLength?: number, maximumLength?: number);
    validate(values: any): string[];
}
