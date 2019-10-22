import "jest";
import { ConfigurationSourceError } from "../../src/Sources/ConfigurationSourceError";
import { ConfigurationSourceInterface } from "../../src/Sources/ConfigurationSourceInterface";
import { EnvironmentVariablesSource } from "../../src/Sources/EnvironmentVariablesSource";

test("should check if a variable name is not empty", () => {
    const envs = {
        HOME: "/root",
        PWD: "/root/pictures/memes",
    };
    expect(() => new EnvironmentVariablesSource("", envs))
        .toThrow(new ConfigurationSourceError("The environment variable name can not be empty."));
});

test("should process APP variables", () => {
    const envs = {
        "APP": "{\"top\":          \"level\"}",
        "APP________Alpha_ALPHA________-BETA---beta-": "gamma",
        "APP__ARR": "[1,2,      \n  3]",
        "APP__OBJ": "{\"alpha\":null}",
        "APP__PRIMITIVE_TYPES__BOOL": "true",
        "APP__PRIMITIVE_TYPES__EMPTY": "",
        "APP__PRIMITIVE_TYPES__NIL": "null",
        "APP__PRIMITIVE_TYPES__NUM": "-123.45",
        "APP__PRIMITIVE_TYPES__STR1": "whatever",
        "APP__PRIMITIVE_TYPES__STR2": "123abc",
        "APP__PRIMITIVE_TYPES__UNDEF": "undefined",
        "HOME": "/root",
        "PWD": "/root/pictures/memes",
        "SOMETHING__HERE": "whatever",
        "SOMETHING__THERE": "whatever",
    };
    const envsSource: ConfigurationSourceInterface = new EnvironmentVariablesSource("APP", envs);
    expect(envsSource.resolve())
        .toEqual({
            top: "level",
            alphaAlpha: {
                betaBeta: "gamma",
            },
            arr: [1, 2, 3],
            obj: { alpha: null },
            primitiveTypes: {
                bool: true,
                empty: "",
                nil: null,
                num: -123.45,
                str1: "whatever",
                str2: "123abc",
                undef: "undefined", // note: this is not a mistake
            },
        });
});

test("should throw an error if a top level variable does not contain an object", () => {
    for (const value of [
        "undefined",
        "null",
        "false",
        "0",
        "",
        "whatever",
        "[1, 2, 3]",
        "{\"alpha\": \"beta\"", // note: lack of closing bracket
    ]) {
        const envs = {
            HOME: "/root",
            PWD: "/root/pictures/memes",
            APP: value,
        };
        const envsSource: ConfigurationSourceInterface = new EnvironmentVariablesSource("APP", envs);
        expect(() => envsSource.resolve())
            .toThrow(new ConfigurationSourceError(`The "APP" environment variable must contain a literal object.`));
    }
});

test("should process MY_APP variables", () => {
    const envs = {
        MY_APP__ALPHA: "beta",
        APP__GAMMA: "delta",
        HOME: "/root",
        PWD: "/root/pictures/memes",
    };
    const envsSource: ConfigurationSourceInterface = new EnvironmentVariablesSource("MY_APP", envs);
    expect(envsSource.resolve())
        .toEqual({
            alpha: "beta",
        });
});

test("should resolve empty object", () => {
    const envs = {
        APP__ALPHA: "beta",
        HOME: "/root",
        PWD: "/root/pictures/memes",
    };
    const envsSource: ConfigurationSourceInterface = new EnvironmentVariablesSource("MY_APP", envs);
    expect(envsSource.resolve())
        .toEqual({});
});
