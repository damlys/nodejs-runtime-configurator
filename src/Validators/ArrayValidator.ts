import { ConfigurationValidatorInterface } from "./ConfigurationValidatorInterface";

export class ArrayValidator implements ConfigurationValidatorInterface {
    private readonly validator: ConfigurationValidatorInterface;
    private readonly minimumLength: number | undefined;
    private readonly maximumLength: number | undefined;

    public constructor(
        validator: ConfigurationValidatorInterface,
        minimumLength?: number,
        maximumLength?: number,
    ) {
        this.validator = validator;
        this.minimumLength = minimumLength;
        this.maximumLength = maximumLength;
    }

    public validate(values: any): string[] {
        if (!(values instanceof Array)) {
            return ["Value must be an array."];
        }

        const errors: string[] = [];

        if (this.minimumLength !== undefined && values.length < this.minimumLength) {
            errors.push(`Array must have at least ${this.minimumLength} items.`);
        }
        if (this.maximumLength !== undefined && values.length > this.maximumLength) {
            errors.push(`Array must have at most ${this.maximumLength} items.`);
        }

        for (let i = 0; i < values.length; i++) {
            this.validator
                .validate(values[i])
                .forEach((error) => {
                    errors.push(`[${i}] ${error}`);
                });
        }

        return errors;
    }
}
