import { ConfigurationValidatorError } from "./ConfigurationValidatorError";
import { ConfigurationValidatorInterface } from "./ConfigurationValidatorInterface";

export class EnumerableValidator implements ConfigurationValidatorInterface {
    private readonly values: any[];

    public constructor(values: any[]) {
        if (values.length === 0) {
            throw new ConfigurationValidatorError("Enumerable validator values can not be empty.");
        }
        this.values = values;
    }

    public validate(value: any): string[] {
        if (!this.values.includes(value)) {
            return [`Value must equal one of the following: ${this.stringifyValues()}.`];
        }
        return [];
    }

    private stringifyValues(): string {
        return this.values
            .map((value) => JSON.stringify(value))
            .join(", ");
    }
}
