import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";
interface EnvironmentVariables {
    [key: string]: string | undefined;
}
export declare class EnvironmentVariablesSource implements ConfigurationSourceInterface {
    private readonly variableName;
    private readonly environmentVariables;
    constructor(variableName?: string, environmentVariables?: EnvironmentVariables);
    resolve(): object;
    private keyToPath;
}
export {};
