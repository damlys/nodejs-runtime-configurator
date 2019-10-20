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

        return mixin(
            {},
            ...values.map((value: string): object => {
                if (value === "") {
                    throw new ConfigurationSourceError(`One or more "--${this.argumentName}" command line arguments does not define configuration item name.`);
                }

                const jsonValue: any = tryParseJson(value);
                if (typeof jsonValue === "object" && jsonValue !== null && !(jsonValue instanceof Array)) {
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
            .map((value) => camelCase(value));
    }
}
