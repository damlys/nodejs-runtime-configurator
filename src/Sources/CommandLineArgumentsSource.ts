import camelCase from "camelcase";
import isPlainObject from "is-plain-object";
import minimist from "minimist";
// @ts-ignore
import mixinDeep from "mixin-deep";
import { createObjectByPathAndValue, tryParseJson } from "../utils";
import { ConfigurationSourceError } from "./ConfigurationSourceError";
import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";

export type CommandLineArguments = string[];

export class CommandLineArgumentsSource implements ConfigurationSourceInterface {
    private readonly commandLineArguments: CommandLineArguments;
    private readonly argumentName: string;

    public constructor(
        commandLineArguments: CommandLineArguments,
        argumentName: string,
    ) {
        if (argumentName === "") {
            throw new ConfigurationSourceError("The command line argument name can not be empty.");
        }
        this.commandLineArguments = commandLineArguments;
        this.argumentName = argumentName;
    }

    public resolve(): object {
        const argv: any = minimist(
            this.commandLineArguments,
            { string: this.argumentName },
        );
        if (argv[this.argumentName] === undefined) {
            return {};
        }

        let values: string[];
        if (argv[this.argumentName] instanceof Array) {
            values = argv[this.argumentName];
        } else {
            values = [argv[this.argumentName]];
        }

        return mixinDeep(
            {},
            ...values.map((value: string): object => {
                if (value === "") {
                    throw new ConfigurationSourceError(`One or more "--${this.argumentName}" command line arguments does not define configuration item name.`);
                }

                const jsonValue: any = tryParseJson(value);
                if (isPlainObject(jsonValue)) {
                    return jsonValue;
                }

                const index: number = value.indexOf("=");
                if (index === -1) {
                    throw new ConfigurationSourceError(`One or more "--${this.argumentName}" command line arguments does not define configuration item value.`);
                }

                return createObjectByPathAndValue(
                    this.keyToPath(value.substr(0, index)),
                    tryParseJson(value.substr(index + 1)),
                );
            }),
        );
    }

    private keyToPath(key: string): string[] {
        return key
            .split(/\.{1,}/)
            .map((value: string): string => camelCase(value));
    }
}
