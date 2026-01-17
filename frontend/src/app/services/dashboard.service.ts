import { computed, inject, Injectable, signal, Signal, WritableSignal } from "@angular/core";
import { DashboardCard, DashboardDataSourceType, DashboardVisualizationType } from "../interfaces/dashboard.interface";
import { PlaidService } from "./plaid.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { BarChartData, DataPoint, PieChartData } from "../interfaces/data.interface";
import { PlaidAccount, PlaidTransaction } from "../interfaces/plaid.interface";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    readonly plaidService = inject(PlaidService);

    // past 7 days
    readonly transactions: Signal<DataPoint<PlaidTransaction>[]> = toSignal(this.plaidService.loadTransactions(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()), { initialValue: [] });
    readonly accountBalances: Signal<DataPoint<PlaidAccount>[]> = toSignal(this.plaidService.loadAccountBalances(new Date(), new Date()), { initialValue: [] });
    
    private _cards: WritableSignal<DashboardCard[]> = signal([]);

    get cards(): Signal<DashboardCard[]> {
        return this._cards;
    }

    readonly numCards = computed(() => this._cards().length);

    addCard() {
        this._cards.update(cards => {
            if (this.numCards() % 2 === 0) {
                return [...cards, { 
                    id: this.numCards() + 1,
                    title: 'New Card',
                    dataSourceType: DashboardDataSourceType.PLAID,
                    visualizationType: DashboardVisualizationType.BAR_CHART,
                    data: this.transactions() ?? []
                }];
            } else {
                return [...cards, { 
                    id: this.numCards() + 1,
                    title: 'New Card',
                    dataSourceType: DashboardDataSourceType.PLAID,
                    visualizationType: DashboardVisualizationType.PIE_CHART,
                    data: this.accountBalances() ?? []
                }];
            }
        });
    }

    updateCard(id: number, card: DashboardCard) {
        this._cards.update(cards => {
            const visualizationType: DashboardVisualizationType = card.visualizationType;
            if (visualizationType === DashboardVisualizationType.BAR_CHART) {
                card.data = this.transactions() ?? [];
            } else if (visualizationType === DashboardVisualizationType.PIE_CHART) {
                card.data = this.accountBalances() ?? [];
            }
            return cards.map(c => c.id === id ? card : c);
        });
    }

    removeCard(id: number) {
        this._cards.update(cards => cards.filter(c => c.id !== id));
    }

}