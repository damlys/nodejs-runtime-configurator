// @ts-ignore
import * as mixin from "mixin-deep";
import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";

export class SourcesAggregator implements ConfigurationSourceInterface {
    private readonly sources: ConfigurationSourceInterface[];

    public constructor(sources: ConfigurationSourceInterface[]) {
        this.sources = sources;
    }

    public resolve(): object {
        return mixin(
            {},
            ...this.sources.map(
                (source: ConfigurationSourceInterface) => source.resolve(),
            ),
        );
    }
}
