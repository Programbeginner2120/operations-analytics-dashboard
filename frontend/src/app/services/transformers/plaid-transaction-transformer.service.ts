import { Injectable } from "@angular/core";
import { PlaidTransaction } from "../../interfaces/plaid.interface";
import { BarChartData } from "../../interfaces/data.interface";

@Injectable({
    providedIn: 'root'
})
export class PlaidTransactionTransformerService {
    /**
     * Transforms PlaidTransaction[] to bar chart grouped by date
     * Acceps unwrapped transaction objects only
     * @param transactions - The transactions to transform
     * @returns The transformed data
     */
    transactionsByDate(transactions: PlaidTransaction[]): BarChartData {
        // Get unique dates and sort them chronologically
        const uniqueDates: string[] = [...new Set(transactions.map(t => t.date))]
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        // Calculate spend for each date
        const spendByDate: number[] = uniqueDates.map(date => 
            transactions
                .filter((t: PlaidTransaction) => t.date === date)
                .reduce((acc: number, t: PlaidTransaction) => acc + t.amount, 0)
        );

        return {
            title: 'Daily Transactions',
            xAxisData: uniqueDates,
            xAxisLabel: 'Date',
            yAxisData: spendByDate,
            yAxisLabel: 'Amount',
            formatter: (value: number) => "$" + value.toFixed(2)
        };
    }
}