import { ConfigurationSourceInterface } from "./ConfigurationSourceInterface";
export declare class SourcesAggregator implements ConfigurationSourceInterface {
    private readonly sources;
    constructor(sources: ConfigurationSourceInterface[]);
    resolve(): object;
}
