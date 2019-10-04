// @ts-ignore
import * as deepFreeze from "deep-freeze";
import { ConfigurationValidatorInterface } from "../Validators/ConfigurationValidatorInterface";
import { ConfigurationItemInterface } from "./ConfigurationItemInterface";

export class ConfigurationItem implements ConfigurationItemInterface {
    private readonly key: string;
    private readonly description: string;
    private readonly defaultValue: any;
    private readonly validators: ConfigurationValidatorInterface[];
    private value: any;

    public constructor(
        key: string,
        description: string,
        defaultValue: any,
        validators: ConfigurationValidatorInterface[] = [],
    ) {
        this.key = key;
        this.description = description;
        this.defaultValue = defaultValue;
        this.validators = validators;

        this.setValue(defaultValue);
    }

    public getKey(): string {
        return this.key;
    }

    public getDescription(): string {
        return this.description;
    }

    public getDefaultValue(): any {
        return this.defaultValue;
    }

    public setValue(value: any): void {
        if (typeof value === "object" && value !== null) {
            deepFreeze(value);
        }
        this.value = value;
    }

    public getValue(): any {
        return this.value;
    }

    public validate(value: any): string[] {
        const errors: string[] = [];
        for (const validator of this.validators) {
            validator
                .validate(value)
                .forEach((error) => {
                    errors.push(error);
                });
        }
        return errors;
    }
}
