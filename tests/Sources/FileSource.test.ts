import "jest";
import { join, normalize } from "path";
import { ConfigurationSourceError } from "../../src/Sources/ConfigurationSourceError";
import { ConfigurationSourceInterface } from "../../src/Sources/ConfigurationSourceInterface";
import { FileSource } from "../../src/Sources/FileSource";

test("should check if a file path is absolute", () => {
    // tslint:disable-next-line:no-unused-expression
    new FileSource("/dir/file.json");

    const filePath: string = "dir/file.json";
    expect(() => new FileSource(filePath))
        .toThrow(new ConfigurationSourceError(`The "${filePath}" path is not absolute.`));
});

test("should check if a file extension is .json or .js", () => {
    // tslint:disable-next-line:no-unused-expression
    new FileSource("/file.json");
    // tslint:disable-next-line:no-unused-expression
    new FileSource("/file.js");

    for (const filePath of [
        "/file",
        "/file.ini",
        "/file.log",
        "/file.txt",
        "/file.yaml",
        "/file.yml",
    ]) {
        expect(() => new FileSource(filePath))
            .toThrow(new ConfigurationSourceError(`The "${filePath}" file path has invalid extension. Only ".json" and ".js" extensions are allowed.`));
    }
});

test("should throw an error if the file path points to a directory", () => {
    const directoryPath: string = join(__dirname, "/../__files__/fake-config-file.js");
    const fileSource: ConfigurationSourceInterface = new FileSource(directoryPath);
    expect(() => fileSource.resolve())
        .toThrow(new ConfigurationSourceError(`The "${normalize(directoryPath)}" path does not point to a file.`));
});

test("should handle files that do not exist", () => {
    const filePath: string = "/this/file/does/not/exist.json";

    const optionalFileSource: ConfigurationSourceInterface = new FileSource(filePath, false);
    expect(optionalFileSource.resolve())
        .toEqual({});

    const requiredFileSource: ConfigurationSourceInterface = new FileSource(filePath);
    expect(() => requiredFileSource.resolve())
        .toThrow(new ConfigurationSourceError(`The "${filePath}" file is required but does not exist.`));
});

test("should throws an error if a file does not contain a literal object", () => {
    for (const value of [
        "array",
        "boolean",
        "function",
        "map",
        "null",
        "number",
        "string",
        "symbol",
        "undefined",
    ]) {
        const filePath: string = join(__dirname, "/../__files__/values/" + value + ".js");
        const fileSource: ConfigurationSourceInterface = new FileSource(filePath);
        expect(() => fileSource.resolve())
            .toThrow(new ConfigurationSourceError(`The "${normalize(filePath)}" file must contain contain a literal object.`));
    }
});

test("should resolve files content", () => {
    const result: object = {
        alpha: {
            beta: {
                gamma: true,
            },
        },
        delta: true,
        epsilon: {
            zeta: true,
        },
        eta: [1, 2, 3],
    };

    const jsonFileSource: ConfigurationSourceInterface = new FileSource(
        join(__dirname, "/../__files__/config-file.json"),
    );
    expect(jsonFileSource.resolve())
        .toEqual(result);

    const jsFileSource: ConfigurationSourceInterface = new FileSource(
        join(__dirname, "/../__files__/config-file.js"),
    );
    expect(jsFileSource.resolve())
        .toEqual(result);
});
