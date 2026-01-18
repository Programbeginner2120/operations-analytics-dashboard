import { Observable } from "rxjs";
import { DashboardCard } from "./dashboard.interface";

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
}