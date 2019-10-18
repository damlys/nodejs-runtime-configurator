import { ConfigurationValidatorInterface } from "./ConfigurationValidatorInterface";

export class RegularExpressionValidator implements ConfigurationValidatorInterface {
    private readonly regularExpression: RegExp;

    public constructor(regexp: RegExp) {
        this.regularExpression = regexp;
    }

    public validate(value: any): string[] {
        if (typeof value !== "string") {
            return ["Value must be a string."];
        }

        if (!this.regularExpression.test(value)) {
            return [`Value does not pass "${this.regularExpression.toString()}" test.`];
        }

        return [];
    }
}
