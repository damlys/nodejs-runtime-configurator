import camelCase from "camelcase";
import isPlainObject from "is-plain-object";
// @ts-ignore
import mixinDeep from "mixin-deep";
import { createObjectByPathAndValue, tryParseJson } from "../utils";
import { ConfigurationSourceError } from "./ConfigurationSourceError";
import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";

interface EnvironmentVariables {
    [key: string]: string | undefined;
}

export class EnvironmentVariablesSource implements ConfigurationSourceInterface {
    private readonly variableName: string;
    private readonly environmentVariables: EnvironmentVariables;

    public constructor(
        variableName: string,
        environmentVariables: EnvironmentVariables,
    ) {
        if (variableName === "") {
            throw new ConfigurationSourceError("The environment variable name can not be empty.");
        }
        this.variableName = variableName;
        this.environmentVariables = environmentVariables;
    }

    public resolve(): object {
        return mixinDeep(
            {},
            ...Object
                .keys(this.environmentVariables)
                .filter((key: string): boolean => {
                    return key === this.variableName || key.startsWith(this.variableName + "__");
                })
                .map((key: string): object => {
                    if (key === this.variableName) {
                        const jsonValue: any = tryParseJson(this.environmentVariables[key] as string);
                        if (isPlainObject(jsonValue)) {
                            return jsonValue;
                        }
                        throw new ConfigurationSourceError(`The "${this.variableName}" environment variable must contain a literal object.`);
                    }

                    return createObjectByPathAndValue(
                        this.keyToPath(key),
                        tryParseJson(this.environmentVariables[key] as string),
                    );
                }),
        );
    }

    private keyToPath(key: string): string[] {
        const path = key
            .split(/_{2,}/)
            .map((value) => camelCase(value));
        path.shift();
        return path;
    }
}
