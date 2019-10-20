import * as camelCase from "camelcase";
// @ts-ignore
import * as mixin from "mixin-deep";
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
        variableName: string = "APP",
        environmentVariables: EnvironmentVariables = process.env,
    ) {
        if (variableName === "") {
            throw new ConfigurationSourceError("The environment variable name can not be empty.");
        }
        this.variableName = variableName;
        this.environmentVariables = environmentVariables;
    }

    public resolve(): object {
        return mixin(
            {},
            ...Object
                .entries(this.environmentVariables)
                .filter(([key, value]: [string, string | undefined]): boolean => {
                    return key === this.variableName || key.startsWith(this.variableName + "__");
                })
                .map(([key, value]: [string, string | undefined]): object => {
                    if (key === this.variableName) {
                        const jsonValue: any = tryParseJson(value as string);
                        if (typeof jsonValue === "object" && jsonValue !== null && !(jsonValue instanceof Array)) {
                            return jsonValue;
                        }
                        throw new ConfigurationSourceError(`The "${this.variableName}" environment variable must contain an object.`);
                    }

                    return createObjectByPathAndValue(
                        this.keyToPath(key),
                        tryParseJson(value as string),
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
