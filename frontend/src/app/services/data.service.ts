import { Injectable } from "@angular/core";
import { DataPoint } from "../interfaces/data.interface";

@Injectable({
    providedIn: 'root'
})

export class DataService {

    /**
     * Unwrap DataPoint<T> to T
     * @param dataPoint - The DataPoint<T> to unwrap
     * @returns The unwrapped data
     */
    unwrapDataPoint<T>(dataPoint: DataPoint<T>): T {
        return dataPoint.value;
    }

    /**
     * Wrap T to DataPoint<T>
     * Useful if you need to re-wrap data for processing in other methods
     * @param data - The data to wrap
     * @returns The wrapped data
     */
    wrapDataPoint<T>(
        value: T,
        metric: string,
        sourceType: string,
        metadataFn?: (value: T) => Record<string, any>
    ): DataPoint<T> {
        return {
            metric,
            value,
            timestamp: new Date(),
            metadata: metadataFn ? metadataFn(value) : {},
            sourceType
        };
    }

}