import { ConfigurationValidatorInterface } from "./ConfigurationValidatorInterface";

interface ObjectOfConfigurationValidators {
    [key: string]: ConfigurationValidatorInterface | undefined;
}

export class ObjectValidator implements ConfigurationValidatorInterface {
    private readonly validators: ObjectOfConfigurationValidators;

    public constructor(validators: ObjectOfConfigurationValidators) {
        this.validators = validators;
    }

    public validate(object: any): string[] {
        if (typeof object !== "object" || object === null || object instanceof Array) {
            return ["Value must be an object."];
        }

        const errors: string[] = [];

        Object
            .keys(this.validators)
            .forEach((key: string): void => {
                if (this.validators[key] === undefined) {
                    return;
                }
                (this.validators[key] as ConfigurationValidatorInterface)
                    .validate(object[key])
                    .forEach((error) => {
                        errors.push(`["${key}"] ${error}`);
                    });
            });

        return errors;
    }
}
