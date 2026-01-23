import { inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { Router } from "@angular/router";
import { Banknote, LucideIconData } from "lucide-angular";

export interface Source {
    sourceName: string;
    sourceDescription: string;
    sourceIcon: LucideIconData;
    routingFn: () => void;
}

@Injectable({
    providedIn: 'root'
})
export class ManageSourcesService {

    readonly router = inject(Router);

    readonly _sources: WritableSignal<Source[]> = signal(
        [
            {
                sourceName: 'Plaid',
                sourceDescription: ' Connect your financial institutions to your dashboard.',
                sourceIcon: Banknote,
                routingFn: () => this.router.navigate(['/manage-sources/plaid'])
            }
        ]
    );

    get sources(): Signal<Source[]> {
        return this._sources;
    }

}