import { Injectable } from "@angular/core";
import { PieChartData } from "../../interfaces/data.interface";
import { PlaidAccount } from "../../interfaces/plaid.interface";

@Injectable({
    providedIn: 'root'
})
export class PlaidAccountTransformerService {
    /**
     * Transform PlaidAccount[] to pie chart by balance
     * Accepts unwrapped accounts only
     * @param accounts - The accounts to transform
     * @returns The transformed data
     */
    accountsByBalance(accounts: PlaidAccount[]): PieChartData {
        return {
            title: 'Account Balances',
            labels: accounts.map((account: PlaidAccount) => account.name),
            values: accounts.map((account: PlaidAccount) => account.balances.current ?? 0),
            formatter: (value: number) => "$" + value.toFixed(2)
        };
    }
}