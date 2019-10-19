import * as camelCase from "camelcase";
// @ts-ignore
import * as mixin from "mixin-deep";
import { EnvironmentVariables } from "../EnvironmentVariables";
import { createObjectByPathAndValue, tryParseJson } from "../utils";
import { ConfigurationSourceError } from "./ConfigurationSourceError";
import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";

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
        const objects: object[] = [];
        for (const key in this.environmentVariables) {
            if (this.environmentVariables.hasOwnProperty(key)) {
                if (key === this.variableName) {
                    const value: any = tryParseJson(this.environmentVariables[key] as string);
                    if (typeof value !== "object" || value === null || value instanceof Array) {
                        throw new ConfigurationSourceError(`The "${this.variableName}" environment variable must contain an object.`);
                    }
                    objects.push(value);
                } else if (key.startsWith(this.variableName + "__")) {
                    objects.push(
                        createObjectByPathAndValue(
                            this.keyToPath(key),
                            tryParseJson(this.environmentVariables[key] as string),
                        ),
                    );
                }
            }
        }
        return mixin({}, ...objects);
    }

    private keyToPath(key: string): string[] {
        const path = key
            .split(/_{2,}/)
            .map((value) => camelCase(value));
        path.shift();
        return path;
    }
}
