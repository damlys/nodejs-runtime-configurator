"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const ConfigurationSourceError_1 = require("./ConfigurationSourceError");
const FileSource_1 = require("./FileSource");
const SourcesAggregator_1 = require("./SourcesAggregator");
class DirectorySource {
    constructor(directoryPath, directoryMustExists = true) {
        if (!path_1.isAbsolute(directoryPath)) {
            throw new ConfigurationSourceError_1.ConfigurationSourceError(`The "${path_1.normalize(directoryPath)}" path is not absolute.`);
        }
        this.directoryPath = directoryPath;
        this.directoryMustExists = directoryMustExists;
    }
    resolve() {
        if (!fs_1.existsSync(this.directoryPath)) {
            if (this.directoryMustExists) {
                throw new ConfigurationSourceError_1.ConfigurationSourceError(`The "${path_1.normalize(this.directoryPath)}" directory is required but does not exist.`);
            }
            else {
                return {};
            }
        }
        const stats = fs_1.statSync(this.directoryPath);
        if (!stats.isDirectory()) {
            throw new ConfigurationSourceError_1.ConfigurationSourceError(`The "${path_1.normalize(this.directoryPath)}" path does not point to a directory.`);
        }
        return new SourcesAggregator_1.SourcesAggregator(fs_1.readdirSync(this.directoryPath, { withFileTypes: true })
            .filter((value) => {
            return value.isFile() && (value.name.endsWith(".json") || value.name.endsWith(".js"));
        })
            .map((value) => {
            return new FileSource_1.FileSource(path_1.join(this.directoryPath, value.name));
        })).resolve();
    }
}
exports.DirectorySource = DirectorySource;
