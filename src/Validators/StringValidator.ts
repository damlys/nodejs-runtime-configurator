import { ConfigurationValidatorInterface } from "./ConfigurationValidatorInterface";

export class StringValidator implements ConfigurationValidatorInterface {
    private readonly minimumLength: number | undefined;
    private readonly maximumLength: number | undefined;

    public constructor(
        minimumLength?: number,
        maximumLength?: number,
    ) {
        this.minimumLength = minimumLength;
        this.maximumLength = maximumLength;
    }

    public validate(value: any): string[] {
        if (typeof value !== "string") {
            return ["Value must be a string."];
        }

        const errors: string[] = [];

        if (this.minimumLength !== undefined && value.length < this.minimumLength) {
            errors.push(`Value must have at least ${this.minimumLength} characters.`);
        }
        if (this.maximumLength !== undefined && value.length > this.maximumLength) {
            errors.push(`Value must have at most ${this.maximumLength} characters.`);
        }

        return errors;
    }
}
