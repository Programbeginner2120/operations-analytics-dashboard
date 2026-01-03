export interface DataPoint<T> {
    metric: string;
    value: T;
    timestamp: Date;
    metadata: Record<string, any>;
    sourceType: string;
}