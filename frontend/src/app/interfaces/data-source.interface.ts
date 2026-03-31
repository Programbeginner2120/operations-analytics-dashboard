import { OutputEmitterRef } from "@angular/core";
import { DashboardVisualizationType, DataQueryConfig, DataTransformConfig } from "./dashboard.interface";

export interface DataSourceConfigSelections {
    metric: string;
    visualizationType: DashboardVisualizationType;
}

/**
 * Minimal contract that every data-source config sub-component must satisfy.
 * DashboardCardComponent discovers and instantiates these via the strategy pattern.
 */
export interface DataSourceConfigComponent {
    configChange: OutputEmitterRef<DataSourceConfigSelections>;
}
