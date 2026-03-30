import { OutputEmitterRef } from "@angular/core";
import { DataQueryConfig, DataTransformConfig } from "./dashboard.interface";

export interface DataSourceConfigOutput {
    queryConfig: DataQueryConfig;
    transformConfig: DataTransformConfig;
}

/**
 * Minimal contract that every data-source config sub-component must satisfy.
 * DashboardCardComponent discovers and instantiates these via the strategy pattern.
 */
export interface DataSourceConfigComponent {
    configChange: OutputEmitterRef<DataSourceConfigOutput>;
}
