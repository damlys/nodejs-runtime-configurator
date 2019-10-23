import "jest";
import * as index from "../src/index";

test("should export package stuff", () => {
    expect(index).toHaveProperty("CommandLinePrinter");

    expect(index).toHaveProperty("ConfigurationBag");
    expect(index).toHaveProperty("ConfigurationItem");
    expect(index).toHaveProperty("ConfigurationSchemaError");

    expect(index).toHaveProperty("CommandLineArgumentsSource");
    expect(index).toHaveProperty("ConfigurationSourceError");
    expect(index).toHaveProperty("DirectorySource");
    expect(index).toHaveProperty("EnvironmentVariablesSource");
    expect(index).toHaveProperty("FileSource");
    expect(index).toHaveProperty("SourcesAggregator");

    expect(index).toHaveProperty("ArrayValidator");
    expect(index).toHaveProperty("BooleanValidator");
    expect(index).toHaveProperty("ConfigurationValidatorError");
    expect(index).toHaveProperty("EnumerableValidator");
    expect(index).toHaveProperty("NumberValidator");
    expect(index).toHaveProperty("ObjectValidator");
    expect(index).toHaveProperty("RegularExpressionValidator");
    expect(index).toHaveProperty("StringValidator");
});
