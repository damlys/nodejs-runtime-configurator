import { ConfigurationValidatorInterface } from "./ConfigurationValidatorInterface";
interface ObjectOfConfigurationValidators {
    [key: string]: ConfigurationValidatorInterface | undefined;
}
export declare class ObjectValidator implements ConfigurationValidatorInterface {
    private readonly validators;
    constructor(validators: ObjectOfConfigurationValidators);
    validate(object: any): string[];
}
export {};
