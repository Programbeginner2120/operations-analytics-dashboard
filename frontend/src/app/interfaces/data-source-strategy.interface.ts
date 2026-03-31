import { Observable } from "rxjs";
import { Type } from "@angular/core";
import { ConnectedDataSource, DashboardCard, DataQueryConfig, DataTransformConfig } from "./dashboard.interface";
import { DataSourceConfigComponent, DataSourceConfigSelections } from "./data-source.interface";

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

    /**
     * Resolves input taken into the data source specific configuration
     * @param selections - input into the data source configuration
     * @returns - output of the data source configuration
     */
    resolveConfig(selections: DataSourceConfigSelections): { queryConfig: DataQueryConfig, transformConfig: DataTransformConfig };

    /**
     * Extracts user selections from a card's existing config.
     * Used to seed the draft state when opening the config modal.
     */
    extractSelections(card: DashboardCard): DataSourceConfigSelections;
}