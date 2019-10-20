import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";
declare type CommandLineArguments = string[];
export declare class CommandLineSource implements ConfigurationSourceInterface {
    private readonly argumentName;
    private readonly commandLineArguments;
    constructor(argumentName?: string, commandLineArguments?: CommandLineArguments);
    resolve(): object;
    private keyToPath;
}
export {};
