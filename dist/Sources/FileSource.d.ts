import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";
export declare class FileSource implements ConfigurationSourceInterface {
    private readonly filePath;
    private readonly fileMustExists;
    constructor(filePath: string, fileMustExists?: boolean);
    resolve(): object;
    private executeFunctions;
}
