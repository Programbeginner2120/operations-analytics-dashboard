import { computed, Injectable, signal, Signal, WritableSignal } from "@angular/core";
import { DashboardCard } from "../interfaces/dashboard.interface";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    
    private _cards: WritableSignal<DashboardCard[]> = signal([]);

    get cards(): Signal<DashboardCard[]> {
        return this._cards;
    }

    readonly numCards = computed(() => this._cards().length);

    addCard() {
        this._cards.update(cards => [...cards, { id: this.numCards() + 1 }]);
    }

}