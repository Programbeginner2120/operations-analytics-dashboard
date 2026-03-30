import { Observable } from "rxjs";
import { Type } from "@angular/core";
import { ConnectedDataSource, DashboardCard } from "./dashboard.interface";
import { DataSourceConfigComponent } from "./data-source-config.interface";

/**
 * Strategy interface for data source implementations
 * Each data source implements this interface
 */
export interface DataSourceStrategy {
    /**
     * The data source this strategy handles
     */
    getSourceType(): string;

    /**
     * Fetch raw data and transform it based on card configuration
     * Returns an Observable of the transformed data
     * NOTE: This is shitty ngl, will fix in a later build
     */
    fetchAndTransform(card: DashboardCard): Observable<any>;

    /**
     * Returns the connected sources for this data source type,
     * each with display metadata and filter options for the card config UI.
     */
    getConnectedSources(): Observable<ConnectedDataSource[]>;

    /**
     * Returns a default partial DashboardCard config for this data source type.
     * Used by DashboardService.addCard() to avoid hardcoded per-source defaults.
     */
    getDefaultCard(): Partial<DashboardCard>;

    /**
     * Returns the Angular component class for the data-source-specific config UI.
     * DashboardCardComponent dynamically loads this component inside its modal.
     */
    getConfigComponent(): Type<DataSourceConfigComponent>;
}