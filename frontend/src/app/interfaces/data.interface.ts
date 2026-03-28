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
    horizontal?: boolean;
    formatter?: (value: number) => string;
}

export interface PieChartData {
    title: string;
    labels: string[];
    values: number[];
    formatter?: (value: number) => string;
}