import * as camelCase from "camelcase";
import * as minimist from "minimist";
// @ts-ignore
import * as mixin from "mixin-deep";
import { CommandLineArguments } from "../CommandLineArguments";
import { createObjectByPathAndValue, tryParseJson } from "../utils";
import { ConfigurationSourceError } from "./ConfigurationSourceError";
import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";

export class CommandLineSource implements ConfigurationSourceInterface {
    private readonly argumentName: string;
    private readonly commandLineArguments: CommandLineArguments;

    public constructor(
        argumentName: string = "override",
        commandLineArguments: CommandLineArguments = process.argv,
    ) {
        if (argumentName === "") {
            throw new ConfigurationSourceError("The command line argument name can not be empty.");
        }
        this.argumentName = argumentName;
        this.commandLineArguments = commandLineArguments;
    }

    public resolve(): object {
        const args: any = minimist(
            this.commandLineArguments,
            { string: this.argumentName },
        );
        if (args[this.argumentName] === undefined) {
            return {};
        }

        let overrides: string[];
        if (args[this.argumentName] instanceof Array) {
            overrides = args[this.argumentName];
        } else {
            overrides = [args[this.argumentName]];
        }

        return mixin(
            {},
            ...overrides.map((override: string): object => {
                if (override === "") {
                    return {};
                }

                const index: number = override.indexOf("=");
                if (index === -1) {
                    return {};
                }

                return createObjectByPathAndValue(
                    this.keyToPath(override.substr(0, index)),
                    tryParseJson(override.substr(index + 1)),
                );
            }),
        );
    }

    private keyToPath(key: string): string[] {
        return key
            .split(/\.{1,}/)
            .map((value) => camelCase(value));
    }
}
