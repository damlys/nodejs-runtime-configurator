import { ConfigurationValidatorInterface } from "../Validators/ConfigurationValidatorInterface";
import { ConfigurationItemInterface } from "./ConfigurationItemInterface";
export declare class ConfigurationItem implements ConfigurationItemInterface {
    private readonly key;
    private readonly description;
    private readonly defaultValue;
    private readonly validators;
    private value;
    constructor(key: string, description: string, defaultValue: any, validators?: ConfigurationValidatorInterface[]);
    getKey(): string;
    getDescription(): string;
    getDefaultValue(): any;
    setValue(value: any): void;
    getValue(): any;
    validate(value: any): string[];
}
