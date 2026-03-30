export enum DashboardDataSourceType {
    PLAID = 'PLAID',
}

export enum DashboardVisualizationType {
    BAR_CHART = 'BAR_CHART',
    PIE_CHART = 'PIE_CHART',
}

/**
 * Base transformatin config
 * This is the base config for all data transformations
 * Taking in a method string here for now, may change later
 */ 
export interface DataTransformConfig {
    method: string;
}

/**
 * Data query config
 * This is the config for the data query
 * Taking in a start date and end date for now, will expand later
 */
export interface DataQueryConfig {
    startDate: Date;
    endDate: Date;
}

/**
 * A connected data source as returned by a strategy's getConnectedSources().
 * Using a local FilterOption type to avoid a potential circular dependency
 * with shared/interfaces/select.interface.ts.
 */
export interface FilterOption {
    value: string;
    label: string;
}

export interface ConnectedDataSource {
    sourceType: DashboardDataSourceType;
    id: string;
    displayName: string;
    filterOptions: FilterOption[];
}

/**
 * Dashboard card
 * This is the interface for a dashboard card
 * It contains the card's title, data source type,
 * visualization type, query config, transform config, raw data, 
 * and transformed data.
 * Will likely expand later to not have a shitty "any" type for the 
 * raw and transformed data, maybe using generics later but for now
 * it's fine.
 */
export interface DashboardCard {
    id: number;
    title: string;
    dataSourceType: DashboardDataSourceType;
    visualizationType: DashboardVisualizationType;
    queryConfig: DataQueryConfig;
    transformConfig: DataTransformConfig;
    rawData?: any[];
    transformedData?: any[];
}