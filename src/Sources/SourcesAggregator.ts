// @ts-ignore
import mixinDeep from "mixin-deep";
import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";

export class SourcesAggregator implements ConfigurationSourceInterface {
    private readonly sources: ConfigurationSourceInterface[];

    public constructor(sources: ConfigurationSourceInterface[]) {
        this.sources = sources;
    }

    public resolve(): object {
        return mixinDeep(
            {},
            ...this.sources
                .map((source: ConfigurationSourceInterface): object => source.resolve()),
        );
    }
}
