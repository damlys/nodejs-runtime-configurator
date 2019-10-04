import "jest";
import { ConfigurationSourceInterface } from "../../src/Sources/ConfigurationSourceInterface";
import { SourcesAggregator } from "../../src/Sources/SourcesAggregator";

test("should aggregate zero sources", () => {
    const sourcesAggregator: ConfigurationSourceInterface = new SourcesAggregator([]);
    expect(sourcesAggregator.resolve())
        .toEqual({});
});

test("should aggregate one source", () => {
    const sourcesAggregator: ConfigurationSourceInterface = new SourcesAggregator([
        {
            resolve: () => {
                return { alpha: true };
            },
        },
    ]);
    expect(sourcesAggregator.resolve())
        .toEqual({ alpha: true });
});

test("should aggregate many sources", () => {
    const sourcesAggregator: ConfigurationSourceInterface = new SourcesAggregator([
        {
            resolve: () => {
                return {
                    alpha: {
                        beta: {
                            gamma: false,
                        },
                    },
                    delta: false,
                    epsilon: {
                        zeta: false,
                    },
                    eta: [1, 2, 3],
                };
            },
        },
        {
            resolve: () => {
                return {
                    alpha: {
                        beta: {
                            omega: true,
                        },
                        omega: true,
                    },
                    delta: true,
                    epsilon: {
                        zeta: true,
                    },
                    eta: [4, 5, 6],
                    theta: [1, 2, 3],
                };
            },
        },
        {
            resolve: () => {
                return {
                    alpha: {
                        omega: 1,
                    },
                    gamma: 2,
                    theta: {
                        omega: 1,
                    },
                };
            },
        },
    ]);
    expect(sourcesAggregator.resolve())
        .toEqual({
            alpha: {
                beta: {
                    gamma: false,
                    omega: true,
                },
                omega: 1,
            },
            gamma: 2,
            delta: true,
            epsilon: {
                zeta: true,
            },
            eta: [4, 5, 6],
            theta: {
                omega: 1,
            },
        });
});
