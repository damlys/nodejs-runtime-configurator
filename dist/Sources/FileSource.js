"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const ConfigurationSourceError_1 = require("./ConfigurationSourceError");
class FileSource {
    constructor(filePath, fileMustExists = true) {
        if (!path_1.isAbsolute(filePath)) {
            throw new ConfigurationSourceError_1.ConfigurationSourceError(`The "${path_1.normalize(filePath)}" path is not absolute.`);
        }
        if (!filePath.endsWith(".json") && !filePath.endsWith(".js")) {
            throw new ConfigurationSourceError_1.ConfigurationSourceError(`The "${path_1.normalize(filePath)}" file path has invalid extension. Only ".json" and ".js" extensions are allowed.`);
        }
        this.filePath = filePath;
        this.fileMustExists = fileMustExists;
    }
    resolve() {
        if (!fs_1.existsSync(this.filePath)) {
            if (this.fileMustExists) {
                throw new ConfigurationSourceError_1.ConfigurationSourceError(`The "${path_1.normalize(this.filePath)}" file is required but does not exist.`);
            }
            else {
                return {};
            }
        }
        const stats = fs_1.statSync(this.filePath);
        if (!stats.isFile()) {
            throw new ConfigurationSourceError_1.ConfigurationSourceError(`The "${path_1.normalize(this.filePath)}" path does not point to a file.`);
        }
        const result = require(this.filePath);
        if (result instanceof Array) {
            throw new ConfigurationSourceError_1.ConfigurationSourceError(`The "${path_1.normalize(this.filePath)}" file contains array instead of an object.`);
        }
        if (result === null) {
            throw new ConfigurationSourceError_1.ConfigurationSourceError(`The "${path_1.normalize(this.filePath)}" file contains null instead of an object.`);
        }
        if (typeof result !== "object") {
            throw new ConfigurationSourceError_1.ConfigurationSourceError(`The "${path_1.normalize(this.filePath)}" file contains ${typeof result} instead of an object.`);
        }
        if (this.filePath.endsWith(".js")) {
            this.executeFunctions(result);
        }
        return result;
    }
    executeFunctions(object) {
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
exports.FileSource = FileSource;
