import "jest";
import { EnvironmentVariables } from "../../src/EnvironmentVariables";
import { ConfigurationSourceError } from "../../src/Sources/ConfigurationSourceError";
import { ConfigurationSourceInterface } from "../../src/Sources/ConfigurationSourceInterface";
import { EnvironmentVariablesSource } from "../../src/Sources/EnvironmentVariablesSource";

test("should check if a name prefix is not empty", () => {
    const envs: EnvironmentVariables = {
        HOME: "/root",
        PWD: "/root/pictures/memes",
    };
    expect(() => new EnvironmentVariablesSource("", envs))
        .toThrow(new ConfigurationSourceError("The environment variables name prefix can not be empty."));
});

test("should process APP__ variables", () => {
    const envs: EnvironmentVariables = {
        "APP________Alpha_ALPHA________-BETA---beta-": "gamma",
        "APP__ARR": "[1,2,3]",
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

test("should resolve empty object", () => {
    const envs: EnvironmentVariables = {
        APP__ALPHA: "beta",
        HOME: "/root",
        PWD: "/root/pictures/memes",
    };
    const envsSource: ConfigurationSourceInterface = new EnvironmentVariablesSource("MY_APP", envs);
    expect(envsSource.resolve())
        .toEqual({});
});

test("should process MY_APP__ variables", () => {
    const envs: EnvironmentVariables = {
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
