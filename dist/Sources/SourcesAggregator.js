"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const mixin = require("mixin-deep");
class SourcesAggregator {
    constructor(sources) {
        this.sources = sources;
    }
    resolve() {
        return mixin({}, ...this.sources.map((source) => source.resolve()));
    }
}
exports.SourcesAggregator = SourcesAggregator;
