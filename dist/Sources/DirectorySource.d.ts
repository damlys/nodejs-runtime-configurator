import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";
export declare class DirectorySource implements ConfigurationSourceInterface {
    private readonly directoryPath;
    private readonly directoryMustExists;
    constructor(directoryPath: string, directoryMustExists?: boolean);
    resolve(): object;
}
