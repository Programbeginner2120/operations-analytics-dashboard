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

    /**
     * Transforms PlaidTransaction[] to bar chart grouped by merchant
     * Accepts unwrapped transaction objects only
     * @param transactions - The transactions to transform
     * @returns - The transformed data
     */
    topMerchantsBySpend(transactions: PlaidTransaction[]): BarChartData {
        const spendByMerchant = new Map<string, number>();

        transactions
            .filter(t => t.amount > 0)
            .forEach(t => {
                const merchant = t.merchant_name ?? t.name;
                spendByMerchant.set(merchant, (spendByMerchant.get(merchant) ?? 0) + t.amount);
            });

        const top10 = [...spendByMerchant.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        return {
            title: 'Top 10 Merchants by Spend',
            xAxisData: top10.map(([merchant]) => merchant),
            xAxisLabel: 'Spend',
            yAxisData: top10.map(([, spend]) => spend),
            yAxisLabel: 'Merchant',
            horizontal: true,
            formatter: (value: number) => "$" + value.toFixed(2)
        };
    }
}