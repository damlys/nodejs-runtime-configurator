import { CommandLineArguments } from "../CommandLineArguments";
import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";
export declare class CommandLineSource implements ConfigurationSourceInterface {
    private readonly argumentName;
    private readonly commandLineArguments;
    constructor(argumentName?: string, commandLineArguments?: CommandLineArguments);
    resolve(): object;
    private keyToPath;
}
