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
            .entries(this.validators)
            .forEach(([key, validator]: [string, ConfigurationValidatorInterface | undefined]): void => {
                if (validator === undefined) {
                    return;
                }
                validator
                    .validate(object[key])
                    .forEach((error) => {
                        errors.push(`["${key}"] ${error}`);
                    });
            });

        return errors;
    }
}
