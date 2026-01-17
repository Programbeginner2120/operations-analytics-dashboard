export interface DataPoint<T> {
    metric: string;
    value: T;
    timestamp: Date;
    metadata: Record<string, any>;
    sourceType: string;
}

export interface BarChartData {
    title: string;
    xAxisData: string[];
    xAxisLabel: string;
    yAxisData: number[];
    yAxisLabel: string;
    formatter?: (value: number) => string;
}