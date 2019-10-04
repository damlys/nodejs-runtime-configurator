import "jest";
import { CommandLineArguments } from "../../src/CommandLineArguments";
import { CommandLineSource } from "../../src/Sources/CommandLineSource";
import { ConfigurationSourceError } from "../../src/Sources/ConfigurationSourceError";
import { ConfigurationSourceInterface } from "../../src/Sources/ConfigurationSourceInterface";

test("should check if an argument name is not empty", () => {
    const args: CommandLineArguments = [
        "/bin/node",
        "/app.js",
        "run",
    ];
    expect(() => new CommandLineSource("", args))
        .toThrow(new ConfigurationSourceError("The command line argument name can not be empty."));
});

test("should process override arguments", () => {
    const args: CommandLineArguments = [
        "/bin/node",
        "/app.js",
        "--override=Alpha-ALPHA.-BETA---beta-=gamma",
        "--override",
        "delta=epsilon",
        "--override=arr=[1,2,3]",
        "--override=obj={\"alpha\":null}",
        "--override=primitiveTypes.bool=true",
        "--override=PrimitiveTypes.emptyStr1=",
        "--override",
        "PrimitiveTypes.emptyStr2=",
        "--override=PrimitiveTypes.Nil=null",
        "--override=Primitive-Types...num=-123.45",
        "--override=primitive---TYPES.str1=whatever",
        "--override=primitive---Types.str2=what=ever",
        "--override=primitive---TYPES.str3=123abc",
        "--override=PRIMITIVE___TYPES.UNDEF=undefined",
        "--ignore=me",
        "run",
        "--me=too",
        "--override",
        "zeta=eta",
    ];
    const cliSource: ConfigurationSourceInterface = new CommandLineSource("override", args);
    expect(cliSource.resolve())
        .toEqual({
            alphaAlpha: {
                betaBeta: "gamma",
            },
            delta: "epsilon",
            zeta: "eta",
            arr: [1, 2, 3],
            obj: { alpha: null },
            primitiveTypes: {
                bool: true,
                emptyStr1: "",
                emptyStr2: "",
                nil: null,
                num: -123.45,
                str1: "whatever",
                str2: "what=ever",
                str3: "123abc",
                undef: "undefined", // note: this is not a mistake
            },
        });
});

test("should handle no override arguments", () => {
    const args: CommandLineArguments = [
        "/bin/node",
        "/app.js",
        "run",
    ];
    const cliSource: ConfigurationSourceInterface = new CommandLineSource("override", args);
    expect(cliSource.resolve())
        .toEqual({});
});

test("should resolve empty object", () => {
    const args: CommandLineArguments = [
        "/bin/node",
        "/app.js",
        "--override=ignore1",
        "--override",
        "ignore2",
        "--override=",
        "ignore3",
        "--override",
        "--ignore4",
        "--override=",
        "--ignore5",
        "--ignore6=whatever",
        "run",
        "--ignore7=whatever",
    ];
    const cliSource: ConfigurationSourceInterface = new CommandLineSource("override", args);
    expect(cliSource.resolve())
        .toEqual({});
});

test("should process change-this arguments", () => {
    const args: CommandLineArguments = [
        "/bin/node",
        "/app.js",
        "--change-this",
        "alpha=beta",
        "--override=epsilon=zeta",
        "run",
    ];
    const cliSource: ConfigurationSourceInterface = new CommandLineSource("change-this", args);
    expect(cliSource.resolve())
        .toEqual({
            alpha: "beta",
        });
});
