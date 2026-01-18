import { Injectable } from "@angular/core";
import { DataSourceStrategy } from "../interfaces/data-source-strategy.interface";

@Injectable({
    providedIn: 'root'
})
export class DataSourceRegistryService {
    private strategies: Map<string, DataSourceStrategy> = new Map<string, DataSourceStrategy>();

    /**
     * Register a data source strategy
     * @param strategy - The strategy to register
     */
    register(strategy: DataSourceStrategy): void {
        this.strategies.set(strategy.getSourceType(), strategy);
    }

    /**
     * Get a strategy by source type
     * Throws error if strategy is not found
     * @param sourceType - The source type to get the strategy for
     * @returns The strategy
     */
    getStrategy(sourceType: string): DataSourceStrategy {
        const strategy = this.strategies.get(sourceType);
        if (!strategy) {
            throw new Error(`No strategy registerd for source type: ${sourceType}`);
        }
        return strategy;
    }

    /**
     * Check if a strategy is registered given a source type
     * @param sourceType - The source type to check
     * @returns True if strategy is registered, false otherwise
     */
    hasStrategy(sourceType: string): boolean {
        return this.strategies.has(sourceType);
    }

    /**
     * Get all registered source types
     * @returns An array of source types
     */
    getRegisteredSourceTypes(): string[] {
        return Array.from(this.strategies.keys());
    }


}