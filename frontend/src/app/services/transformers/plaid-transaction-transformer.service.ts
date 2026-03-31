import { Injectable } from "@angular/core";
import { PlaidTransaction } from "../../interfaces/plaid.interface";
import { BarChartData, StackedBarChartData } from "../../interfaces/data.interface";

@Injectable({
    providedIn: 'root'
})
export class PlaidTransactionTransformerService {

    readonly MONTHS: Record<number, string> = {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December"
    };

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
                const merchant = t.merchantName ?? t.name;
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

    /**
     * Transforms PlaidTransaction[] to stacked bar chart grouped by month and category
     * Accepts unwrapped transaction objects only
     * @param transactions - The transactions to transform
     * @returns - The transformed data
     */
    yearlySpendByMonthAndCategory(transactions: PlaidTransaction[]): StackedBarChartData {
        const spendCategories: Map<string, string[]> = new Map<string, string[]>([
            ["Housing", ["RENT_AND_UTILITIES", "HOME_IMPROVEMENT"]],
            ["Food", ["FOOD_AND_DRINK"]],
            ["Transportation", ["TRANSPORTATION"]],
            ["Discretionary", ["ENTERTAINMENT", "TRAVEL", "PERSONAL_CARE", "GENERAL_MERCHANDISE"]],
            ["Financial Obligations", ["LOAN_PAYMENTS", "BANK_FEES", "GOVERNMENT_AND_NON_PROFIT"]],
            ["Other", ["MEDICAL", "GENERAL_SERVICES"]]
        ]);

        const desiredTransactions: PlaidTransaction[] = transactions
            .filter(transaction => transaction.amount > 0)
            .filter(transaction => 
                Array.from(spendCategories.values())
                .flatMap(arr => arr).includes(transaction.personalFinanceCategory?.primary || ''))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const desiredMonths: string[] = this.getMonthsFromDateRange(
            new Date(desiredTransactions[0].date),
            new Date(desiredTransactions[desiredTransactions.length - 1].date)
        );

        const spendByMonthAndCategory: Map<string, Map<string, number>> = new Map<string, Map<string, number>>(
            desiredMonths.map(month => 
                [month, new Map<string, number>(Array.from(spendCategories.keys()).map(
                    spendCategory => [spendCategory, 0])
                )
            ])
        );

        desiredTransactions.forEach(transaction => {
            const month: string = this.MONTHS[new Date(transaction.date).getMonth()];
            const amount = transaction.amount;
            const primary = transaction.personalFinanceCategory?.primary!; // transaction would have been filtered beforehand if primary not present

            // Map the raw Plaid primary category to the friendly category name
            const category = Array.from(spendCategories.entries())
                .find(([, primaries]) => primaries.includes(primary))?.[0];
            if (!category) return;

            const updatedAmount = (spendByMonthAndCategory.get(month)?.get(category) ?? 0) + amount;
            spendByMonthAndCategory.get(month)?.set(category, updatedAmount);
        });

        return {
            title: 'Yearly Spend by Month and Category',
            xAxisData: desiredMonths,
            xAxisLabel: 'Month',
            series: Array.from(spendCategories.keys()).map(category => ({
                name: category,
                data: desiredMonths.map(month => spendByMonthAndCategory.get(month)?.get(category) ?? 0)
            })),
            yAxisLabel: 'Amount ($)',
            horizontal: false,
            formatter: (value: number) => "$" + value.toFixed(2)
        };
    }

    private getMonthsFromDateRange(startDate: Date, endDate: Date) {
        const startMonth = startDate.getMonth();
        const endMonth = endDate.getMonth();

        const desiredMonths = [];
        for (let iter = startMonth; iter <= endMonth; iter++) {
            desiredMonths.push(this.MONTHS[iter]);
        }

        return desiredMonths;
    }
}