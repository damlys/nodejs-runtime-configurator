import { existsSync, readdirSync, Stats, statSync } from "fs";
import { extname, isAbsolute, join, normalize } from "path";
import { ConfigurationSourceError } from "./ConfigurationSourceError";
import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";
import { FileSource } from "./FileSource";
import { SourcesAggregator } from "./SourcesAggregator";

export class DirectorySource implements ConfigurationSourceInterface {
    private readonly directoryPath: string;
    private readonly directoryMustExists: boolean;

    public constructor(
        directoryPath: string,
        directoryMustExists: boolean = true,
    ) {
        if (!isAbsolute(directoryPath)) {
            throw new ConfigurationSourceError(`The "${normalize(directoryPath)}" path is not absolute.`);
        }
        this.directoryPath = directoryPath;
        this.directoryMustExists = directoryMustExists;
    }

    public resolve(): object {
        if (!existsSync(this.directoryPath)) {
            if (this.directoryMustExists) {
                throw new ConfigurationSourceError(`The "${normalize(this.directoryPath)}" directory is required but does not exist.`);
            } else {
                return {};
            }
        }

        const stats: Stats = statSync(this.directoryPath);
        if (!stats.isDirectory()) {
            throw new ConfigurationSourceError(`The "${normalize(this.directoryPath)}" path does not point to a directory.`);
        }

        return new SourcesAggregator(
            readdirSync(this.directoryPath)
                .filter((value: string): boolean => {
                    const elementStats: Stats = statSync(join(this.directoryPath, value));
                    return elementStats.isFile() && (extname(value) === ".json" || extname(value) === ".js");
                })
                .map((value: string): ConfigurationSourceInterface => {
                    return new FileSource(join(this.directoryPath, value));
                }),
        ).resolve();
    }
}
