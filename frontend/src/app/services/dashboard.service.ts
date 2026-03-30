import { computed, inject, Injectable, signal, Signal, WritableSignal } from "@angular/core";
import { ConnectedDataSource, DashboardCard } from "../interfaces/dashboard.interface";
import { DataSourceRegistryService } from "./data-source-registry.service";
import { PlaidDataSourceStrategyService } from "./strategies/plaid-data-source-strategy.service";
import { catchError, forkJoin, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private readonly registry = inject(DataSourceRegistryService);
    private readonly plaidStrategy = inject(PlaidDataSourceStrategyService);

    private readonly _cards: WritableSignal<DashboardCard[]> = signal([]);

    /** null = still loading, true/false = resolved */
    readonly hasConnectedDataSources = signal<boolean | null>(null);
    readonly connectedDataSources = signal<ConnectedDataSource[]>([]);

    constructor() {
        // Register all available strategies
        this.registry.register(this.plaidStrategy);

        // Check if the user has any connected data sources
        this.refreshDataSourceStatus();
    }

    /**
     * Re-check whether the user has any connected data sources.
     * Delegates to each registered strategy's getConnectedSources().
     * Called on construction and each time the dashboard route is activated.
     */
    refreshDataSourceStatus(): void {
        const sourceTypes = this.registry.getRegisteredSourceTypes();
        if (sourceTypes.length === 0) {
            this.connectedDataSources.set([]);
            this.hasConnectedDataSources.set(false);
            return;
        }

        const requests = sourceTypes.map(type =>
            this.registry.getStrategy(type).getConnectedSources().pipe(catchError(() => of([])))
        );

        forkJoin(requests).subscribe(results => {
            const all: ConnectedDataSource[] = ([] as ConnectedDataSource[]).concat(...results);
            this.connectedDataSources.set(all);
            this.hasConnectedDataSources.set(all.length > 0);
        });
    }

    get cards(): Signal<DashboardCard[]> {
        return this._cards;
    }

    readonly numCards = computed(() => this._cards().length);

   /**
    * Add a new card with default configuration sourced from the first registered strategy.
    */
   addCard(): void {
    if (this.hasConnectedDataSources() !== true) return;

    const sourceTypes = this.registry.getRegisteredSourceTypes();
    if (sourceTypes.length === 0) return;

    const defaultPartial = this.registry.getStrategy(sourceTypes[0]).getDefaultCard();
    const newId: number = this.numCards() + 1;

    const newCard: DashboardCard = {
        ...defaultPartial,
        id: newId,
    } as DashboardCard;

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