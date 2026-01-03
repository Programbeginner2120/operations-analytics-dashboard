import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DataPoint } from "../interfaces/data.interface";

@Injectable({
    providedIn: 'root'
})
export class PlaidService {

    private http = inject(HttpClient);

    private readonly API_URL = '/plaid';

    loadAccountBalances(startDate: Date, endDate: Date): Observable<DataPoint<any>[]> {
        return this.http.get<DataPoint<any>[]>(`${this.API_URL}/account-balances`, {
            params: {
                startDate: this.formatDate(startDate),
                endDate: this.formatDate(endDate)
            }
        });
    }

    loadTransactions(startDate: Date, endDate: Date): Observable<DataPoint<any>[]> {
        return this.http.get<DataPoint<any>[]>(`${this.API_URL}/transactions`, {
            params: {
                startDate: this.formatDate(startDate),
                endDate: this.formatDate(endDate)
            }
        });
    }

    private formatDate(date: Date): string {
        return date.toISOString().slice(0, 19);
    }


}