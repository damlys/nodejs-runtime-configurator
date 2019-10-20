import "jest";
import { CommandLineSource } from "../../src/Sources/CommandLineSource";
import { ConfigurationSourceError } from "../../src/Sources/ConfigurationSourceError";
import { ConfigurationSourceInterface } from "../../src/Sources/ConfigurationSourceInterface";

test("should check if an argument name is not empty", () => {
    const args = [
        "/bin/node",
        "/app.js",
        "run",
    ];
    expect(() => new CommandLineSource("", args))
        .toThrow(new ConfigurationSourceError("The command line argument name can not be empty."));
});

test("should process override arguments", () => {
    const args = [
        "/bin/node",
        "/app.js",
        "--override={\"top1\":       \"level1\"}",
        "--override={\"top2\":  \n   \"level2\"}",
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
            top1: "level1",
            top2: "level2",
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

test("should throw an error if argument is invalid", () => {
    for (const args of [
        ["/bin/node", "/app.js", "--override=", "whatever"],
        ["/bin/node", "/app.js", "--override=", "--whatever"],
        ["/bin/node", "/app.js", "--override", "--whatever"],
    ]) {
        const cliSource: ConfigurationSourceInterface = new CommandLineSource("override", args);
        expect(() => cliSource.resolve())
            .toThrow(new ConfigurationSourceError(`One or more "--override" command line arguments does not define configuration item name.`));
    }

    for (const args of [
        ["/bin/node", "/app.js", "--override=whatever"],
        ["/bin/node", "/app.js", "--override", "whatever"],
    ]) {
        const cliSource: ConfigurationSourceInterface = new CommandLineSource("override", args);
        expect(() => cliSource.resolve())
            .toThrow(new ConfigurationSourceError(`One or more "--override" command line arguments does not define configuration item value.`));
    }
});

test("should process one argument (--change-this)", () => {
    const args = [
        "/bin/node",
        "/app.js",
        "--change-this=alpha=beta",
        "--override=epsilon=zeta",
        "run",
    ];
    const cliSource: ConfigurationSourceInterface = new CommandLineSource("change-this", args);
    expect(cliSource.resolve())
        .toEqual({
            alpha: "beta",
        });
});

test("should handle no arguments", () => {
    const args = [
        "/bin/node",
        "/app.js",
        "run",
    ];
    const cliSource: ConfigurationSourceInterface = new CommandLineSource("override", args);
    expect(cliSource.resolve())
        .toEqual({});
});
