export interface ConfigurationItemInterface {
    getKey(): string;
    getDescription(): string;
    getDefaultValue(): any;
    setValue(value: any): void;
    getValue(): any;
    validate(value: any): string[];
}
