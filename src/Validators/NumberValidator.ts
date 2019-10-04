import { ConfigurationValidatorInterface } from "./ConfigurationValidatorInterface";

export class NumberValidator implements ConfigurationValidatorInterface {
    private readonly mustBeInteger: boolean;
    private readonly minimumValue: number | undefined;
    private readonly maximumValue: number | undefined;

    public constructor(
        mustBeInteger: boolean = false,
        minimumValue?: number,
        maximumValue?: number,
    ) {
        this.mustBeInteger = mustBeInteger;
        this.minimumValue = minimumValue;
        this.maximumValue = maximumValue;
    }

    public validate(value: any): string[] {
        if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
            return ["Value must be a number."];
        }

        const errors: string[] = [];

        if (this.mustBeInteger && !Number.isInteger(value)) {
            errors.push("Value must be an integer.");
        }
        if (this.minimumValue !== undefined && value < this.minimumValue) {
            errors.push(`Value must be bigger than ${this.minimumValue}.`);
        }
        if (this.maximumValue !== undefined && value > this.maximumValue) {
            errors.push(`Value must be smaller than ${this.maximumValue}.`);
        }

        return errors;
    }
}
