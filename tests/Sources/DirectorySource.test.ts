import "jest";
import { join, normalize } from "path";
import { ConfigurationSourceError } from "../../src/Sources/ConfigurationSourceError";
import { ConfigurationSourceInterface } from "../../src/Sources/ConfigurationSourceInterface";
import { DirectorySource } from "../../src/Sources/DirectorySource";

test("should check if a directory path is absolute", () => {
    // tslint:disable-next-line:no-unused-expression
    new DirectorySource("/dir");

    const directoryPath = "dir";
    expect(() => new DirectorySource(directoryPath))
        .toThrow(new ConfigurationSourceError(`The "${directoryPath}" path is not absolute.`));
});

test("should throw an error if directory path points to a file", () => {
    const filePath = join(__dirname, "/../__files__/config-file.js");
    const directorySource: ConfigurationSourceInterface = new DirectorySource(filePath);
    expect(() => directorySource.resolve())
        .toThrow(new ConfigurationSourceError(`The "${normalize(filePath)}" path does not point to a directory.`));
});

test("should handle directories that do not exist", () => {
    const directoryPath = "/this/directory/does/not/exist";

    const optionalDirectorySource: ConfigurationSourceInterface = new DirectorySource(directoryPath, false);
    expect(optionalDirectorySource.resolve())
        .toEqual({});

    const requiredDirectorySource: ConfigurationSourceInterface = new DirectorySource(directoryPath);
    expect(() => requiredDirectorySource.resolve())
        .toThrow(new ConfigurationSourceError(`The "${directoryPath}" directory is required but does not exist.`));
});

test("should handle empty directories", () => {
    const directoryPath = join(__dirname, "/../__files__/empty-dir");
    const directorySource: ConfigurationSourceInterface = new DirectorySource(directoryPath);
    expect(directorySource.resolve())
        .toEqual({});
});

test("should resolve directory content", () => {
    const directoryPath = join(__dirname, "/../__files__/dir");
    const directorySource: ConfigurationSourceInterface = new DirectorySource(directoryPath);
    expect(directorySource.resolve())
        .toEqual({
                alpha: true,
                beta: 1,
                gamma: "whatever",
                delta: [1, 2, 3],
            },
        );
});
