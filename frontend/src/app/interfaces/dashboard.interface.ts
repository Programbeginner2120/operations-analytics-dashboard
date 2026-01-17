export enum DashboardDataSourceType {
    PLAID = 'PLAID',
}

export enum DashboardVisualizationType {
    BAR_CHART = 'BAR_CHART',
    PIE_CHART = 'PIE_CHART',
}

export interface DashboardCard {
    id: number;
    title: string;
    dataSourceType: DashboardDataSourceType;
    visualizationType: DashboardVisualizationType;
    data: any[];
}