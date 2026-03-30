export interface DataPoint<T> {
    metric: string;
    value: T;
    timestamp: Date;
    metadata: Record<string, any>;
    sourceType: string;
}

interface BaseBarChartData {
    title: string;
    xAxisData: string[];
    xAxisLabel: string;
    yAxisLabel: string;
    horizontal?: boolean;
    formatter?: (value: number) => string;
}

export interface BarChartData extends BaseBarChartData {
    yAxisData: number[];
}

export interface StackedBarChartData extends BaseBarChartData {
    series: { name: string; data: number[] }[];
}

export interface PieChartData {
    title: string;
    labels: string[];
    values: number[];
    formatter?: (value: number) => string;
}