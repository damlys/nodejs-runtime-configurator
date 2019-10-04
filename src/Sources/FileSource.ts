import { existsSync, statSync } from "fs";
import { isAbsolute, normalize } from "path";
import { ConfigurationSourceError } from "./ConfigurationSourceError";
import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";

export class FileSource implements ConfigurationSourceInterface {
    private readonly filePath: string;
    private readonly fileMustExists: boolean;

    public constructor(
        filePath: string,
        fileMustExists: boolean = true,
    ) {
        if (!isAbsolute(filePath)) {
            throw new ConfigurationSourceError(`The "${normalize(filePath)}" path is not absolute.`);
        }
        if (!filePath.endsWith(".json") && !filePath.endsWith(".js")) {
            throw new ConfigurationSourceError(`The "${normalize(filePath)}" file path has invalid extension. Only ".json" and ".js" extensions are allowed.`);
        }
        this.filePath = filePath;
        this.fileMustExists = fileMustExists;
    }

    public resolve(): object {
        if (!existsSync(this.filePath)) {
            if (this.fileMustExists) {
                throw new ConfigurationSourceError(`The "${normalize(this.filePath)}" file is required but does not exist.`);
            } else {
                return {};
            }
        }

        const stats = statSync(this.filePath);
        if (!stats.isFile()) {
            throw new ConfigurationSourceError(`The "${normalize(this.filePath)}" path does not point to a file.`);
        }

        const result = require(this.filePath);
        if (result instanceof Array) {
            throw new ConfigurationSourceError(`The "${normalize(this.filePath)}" file contains array instead of an object.`);
        }
        if (result === null) {
            throw new ConfigurationSourceError(`The "${normalize(this.filePath)}" file contains null instead of an object.`);
        }
        if (typeof result !== "object") {
            throw new ConfigurationSourceError(`The "${normalize(this.filePath)}" file contains ${typeof result} instead of an object.`);
        }
        if (this.filePath.endsWith(".js")) {
            this.executeFunctions(result);
        }
        return result;
    }

    private executeFunctions(object: any): void {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                while (typeof object[key] === "function") {
                    object[key] = object[key]();
                }
                if (typeof object[key] === "object" && object[key] !== null) {
                    this.executeFunctions(object[key]);
                }
            }
        }
    }
}
