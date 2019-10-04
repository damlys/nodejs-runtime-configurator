import { ConfigurationValidatorInterface } from "./ConfigurationValidatorInterface";

export class BooleanValidator implements ConfigurationValidatorInterface {
    public validate(value: any): string[] {
        if (typeof value !== "boolean") {
            return ["Value must be a boolean."];
        }
        return [];
    }
}
