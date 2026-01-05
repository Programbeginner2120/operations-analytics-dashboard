import { Component, computed, signal, WritableSignal } from "@angular/core";

export interface DashboardCard {
    id: number;
}

@Component({
    selector: 'app-dashboard-layout',
    templateUrl: './dashboard-layout.component.html',
    styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent {
    // signals
    cards: WritableSignal<DashboardCard[]> = signal([]);

    numCards = computed(() => this.cards().length);

    addCard() {
        this.cards.update(cards => [...cards, { id: this.numCards() + 1 }]);
    }
}