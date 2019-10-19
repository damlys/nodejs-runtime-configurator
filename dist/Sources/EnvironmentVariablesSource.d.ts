import { EnvironmentVariables } from "../EnvironmentVariables";
import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";
export declare class EnvironmentVariablesSource implements ConfigurationSourceInterface {
    private readonly variableName;
    private readonly environmentVariables;
    constructor(variableName?: string, environmentVariables?: EnvironmentVariables);
    resolve(): object;
    private keyToPath;
}
