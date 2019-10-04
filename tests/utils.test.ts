import "jest";
import { createObjectByPathAndValue, getFromObjectByPath, tryParseJson } from "../src/utils";

test("createObjectByPathAndValue", () => {
    expect(() => createObjectByPathAndValue([], null))
        .toThrow(new Error("Path can not be empty."));

    expect(createObjectByPathAndValue(["alpha"], null))
        .toEqual({ alpha: null });

    expect(createObjectByPathAndValue(["alpha", "beta"], true))
        .toEqual({ alpha: { beta: true } });

    expect(createObjectByPathAndValue(["alpha", "beta", "gamma"], [1, 2, 3]))
        .toEqual({ alpha: { beta: { gamma: [1, 2, 3] } } });
});

test("getFromObjectByPath", () => {
    for (const value of [
        undefined,
        null,
        false,
        0,
        "",
        Symbol("whatever"),
        [],
    ]) {
        expect(() => getFromObjectByPath(value, ["alpha"]))
            .toThrow(new Error("Target must be an object."));
    }

    const target: any = {
        alpha: {
            beta: {
                gamma: null,
            },
        },
    };

    expect(() => getFromObjectByPath(target, []))
        .toThrow(new Error("Path can not be empty."));

    expect(getFromObjectByPath(target, ["alpha"]))
        .toEqual(target.alpha);
    expect(getFromObjectByPath(target, ["alpha", "beta"]))
        .toEqual(target.alpha.beta);
    expect(getFromObjectByPath(target, ["alpha", "beta", "gamma"]))
        .toBe(target.alpha.beta.gamma);

    expect(getFromObjectByPath(target, ["alpha", "beta", "gamma", "delta"]))
        .toBe(undefined);
    expect(getFromObjectByPath(target, ["omega"]))
        .toBe(undefined);
});

test("tryParseJson", () => {
    expect(tryParseJson("null")).toEqual(null);
    expect(tryParseJson("undefined")).toEqual("undefined"); // note: this is not a mistake
    expect(tryParseJson("true")).toEqual(true);
    expect(tryParseJson("-123.45")).toEqual(-123.45);
    expect(tryParseJson("-123.45x")).toEqual("-123.45x");
    expect(tryParseJson("")).toEqual("");
    expect(tryParseJson("whatever")).toEqual("whatever");
    expect(tryParseJson("[1,2,3]")).toEqual([1, 2, 3]);
    expect(tryParseJson("[1,2,3")).toEqual("[1,2,3");
    expect(tryParseJson('{"alpha":null}')).toEqual({ alpha: null });
    expect(tryParseJson('{"alpha":null')).toEqual('{"alpha":null');
});
