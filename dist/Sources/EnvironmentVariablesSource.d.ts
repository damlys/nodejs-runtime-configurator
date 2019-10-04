import { EnvironmentVariables } from "../EnvironmentVariables";
import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";
export declare class EnvironmentVariablesSource implements ConfigurationSourceInterface {
    private readonly variablesNamePrefix;
    private readonly environmentVariables;
    constructor(variablesNamePrefix?: string, environmentVariables?: EnvironmentVariables);
    resolve(): object;
    private keyToPath;
}
