import * as camelCase from "camelcase";
// @ts-ignore
import * as mixin from "mixin-deep";
import { EnvironmentVariables } from "../EnvironmentVariables";
import { createObjectByPathAndValue, tryParseJson } from "../utils";
import { ConfigurationSourceError } from "./ConfigurationSourceError";
import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";

export class EnvironmentVariablesSource implements ConfigurationSourceInterface {
    private readonly variablesNamePrefix: string;
    private readonly environmentVariables: EnvironmentVariables;

    public constructor(
        variablesNamePrefix: string = "APP",
        environmentVariables: EnvironmentVariables = process.env,
    ) {
        if (variablesNamePrefix === "") {
            throw new ConfigurationSourceError("The environment variables name prefix can not be empty.");
        }
        this.variablesNamePrefix = variablesNamePrefix;
        this.environmentVariables = environmentVariables;
    }

    public resolve(): object {
        const objects: object[] = [];
        for (const key in this.environmentVariables) {
            if (this.environmentVariables.hasOwnProperty(key)) {
                if (key.startsWith(this.variablesNamePrefix + "__")) {
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
