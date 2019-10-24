import isPlainObject from "is-plain-object";

export function createObjectByPathAndValue(path: string[], value: any): object {
    if (path.length === 0) {
        throw new Error("Path can not be empty.");
    }

    const result: any = {};
    let pointer: any = result;
    for (let i: number = 0; i < path.length - 1; i++) {
        pointer = pointer[path[i]] = {};
    }
    pointer[path[path.length - 1]] = value;
    return result;
}

export function getFromObjectByPath(target: any, path: string[]): any {
    if (!isPlainObject(target)) {
        throw new Error("Target must be a literal object.");
    }
    if (path.length === 0) {
        throw new Error("Path can not be empty.");
    }

    let pointer: any = target;
    for (const key of path) {
        if (typeof pointer !== "object" || pointer === null || !pointer.hasOwnProperty(key)) {
            return undefined;
        }
        pointer = pointer[key];
    }
    return pointer;
}

export function tryParseJson(value: string): any {
    try {
        return JSON.parse(value);
    } catch (error) {
        return value;
    }
}
