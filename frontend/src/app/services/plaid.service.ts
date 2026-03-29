import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DataPoint } from "../interfaces/data.interface";
import { LinkTokenResponse, PlaidAccount, PlaidItem, PlaidTransaction } from "../interfaces/plaid.interface";

@Injectable({
    providedIn: 'root'
})
export class PlaidService {

    private http = inject(HttpClient);

    private readonly API_URL = '/plaid';

    loadAccountBalances(startDate: Date, endDate: Date, institutionId?: string): Observable<DataPoint<PlaidAccount>[]> {
        return this.http.get<DataPoint<PlaidAccount>[]>(`${this.API_URL}/account-balances`, {
            params: {
                startDate: this.formatDate(startDate),
                endDate: this.formatDate(endDate),
                ...(institutionId ? { institutionId } : {})
            }
        });
    }

    loadTransactions(startDate: Date, endDate: Date, institutionId?: string): Observable<DataPoint<PlaidTransaction>[]> {
        return this.http.get<DataPoint<PlaidTransaction>[]>(`${this.API_URL}/transactions`, {
            params: {
                startDate: this.formatDate(startDate),
                endDate: this.formatDate(endDate),
                ...(institutionId ? { institutionId } : {})
            }
        });
    }

    createLinkToken(): Observable<LinkTokenResponse> {
        return this.http.post<LinkTokenResponse>(`${this.API_URL}/link-token`, {});
    }

    exchangePublicToken(publicToken: string): Observable<PlaidItem> {
        return this.http.post<PlaidItem>(`${this.API_URL}/exchange-token`, { publicToken });
    }

    getConnectedItems(): Observable<PlaidItem[]> {
        return this.http.get<PlaidItem[]>(`${this.API_URL}/items`);
    }

    deleteItem(itemId: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/items/${itemId}`);
    }

    private formatDate(date: Date): string {
        return date.toISOString().slice(0, 19);
    }


}