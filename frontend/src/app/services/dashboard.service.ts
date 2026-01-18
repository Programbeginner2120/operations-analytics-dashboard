import { computed, inject, Injectable, signal, Signal, WritableSignal } from "@angular/core";
import { DashboardCard, DashboardDataSourceType, DashboardVisualizationType } from "../interfaces/dashboard.interface";
import { PlaidService } from "./plaid.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { BarChartData, DataPoint, PieChartData } from "../interfaces/data.interface";
import { PlaidAccount, PlaidDataTransformConfig, PlaidTransaction } from "../interfaces/plaid.interface";
import { DataSourceRegistryService } from "./data-source-registry.service";
import { PlaidDataSourceStrategyService } from "./strategies/plaid-data-source-strategy.service";
import { catchError, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private readonly registry = inject(DataSourceRegistryService);
    private readonly plaidStrategy = inject(PlaidDataSourceStrategyService);

    private readonly _cards: WritableSignal<DashboardCard[]> = signal([]);

    constructor() {
        // Register all available strategies
        this.registry.register(this.plaidStrategy);
    }

    get cards(): Signal<DashboardCard[]> {
        return this._cards;
    }

    readonly numCards = computed(() => this._cards().length);

   /**
    * Add a new card with default configuration
    */
   addCard(): void {
    const newId: number = this.numCards() + 1;
    
    const newCard: DashboardCard = {
        id: newId,
        title: 'New Transactions Bar Chart Card',
        dataSourceType: DashboardDataSourceType.PLAID,
        visualizationType: DashboardVisualizationType.BAR_CHART,
        queryConfig: {
            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            endDate: new Date()
        },
        transformConfig: {
            method: 'transactionsByDate'
        } as PlaidDataTransformConfig
    };

    // Add card and trigger data fetch
    this._cards.update(cards => [...cards, newCard]);
    this.refreshCardData(newCard.id);
   }

   /**
    * Update an existing card's configuration
    * @param id - The id of the card to update
    * @param updates - The updates to apply to the card
    */
   updateCard(id: number, updates: Partial<DashboardCard>): void {
    let needsRefresh = false;
    
    this._cards.update(cards => 
        cards.map(card => {
            if (card.id === id) {
                const updatedCard = { ...card, ...updates } as DashboardCard;

                // If config changed, clear transformed data to trigger refresh
                if (updates.queryConfig || updates.transformConfig || updates.visualizationType) {
                    updatedCard.transformedData = undefined;
                    needsRefresh = true;
                }

                return updatedCard;
            }
            return card;
        })
    );
    
    // Call refreshCardData if config changed
    if (needsRefresh) {
        this.refreshCardData(id);
    }
   }

   /**
    * Remove a card
    * @param id - The id of the card to remove
    */
   removeCard(id: number): void {
    this._cards.update(cards => cards.filter(card => card.id !== id));
   }

   /**
    * Refresh data for a specific card using appropriate strategy
    */
   refreshCardData(cardId: number): void {
    const card = this._cards().find(c => c.id === cardId);
    if (!card) return;

    // Get the appropriate strategy from registry
    const strategy = this.registry.getStrategy(card.dataSourceType);

    // Fetch and transform using strategy
    strategy.fetchAndTransform(card).pipe(
        catchError(error => {
            console.error(`Error fetching data for card ${cardId}:`, error);
            return of(null);
        })
    ).subscribe(transformedData => {
        if (transformedData) {
            this._cards.update(cards => 
                cards.map(c => c.id === cardId ? { ...c, transformedData } : c))
        }
    });
   }

   /**
    * Refresh all cards' data
    */
   refreshAllCards(): void {
    this._cards().forEach(card => this.refreshCardData(card.id));
   }

}