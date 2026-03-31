import { DataQueryConfig, DataTransformConfig } from "./dashboard.interface";
import { DataSourceConfigSelections } from "./data-source.interface";

/**
 * Plaid-specific query config — extends the base with the institution filter
 */
export interface PlaidDataQueryConfig extends DataQueryConfig {
    institutionId?: string;
}

/**
 * Plaid-specific data source config selections - extends the base with the institution filter
 */
export interface PlaidDataSourceConfigSelections extends DataSourceConfigSelections {
  institutionId: string;
}

// Minimal Account Interface
export interface PlaidAccountBalance {
  current: number | null;
  available: number | null;
  isoCurrencyCode: string | null;
}

export interface PlaidAccount {
  accountId: string;
  name: string;
  type: string;
  subtype: string | null;
  mask: string | null;
  balances: PlaidAccountBalance;
}

// Minimal Transaction Interface
export interface PlaidTransaction {
  transactionId: string;
  accountId: string;
  amount: number;
  date: string;
  name: string;
  merchantName: string | null;
  category: string[] | null;
  pending: boolean;
  paymentChannel: string;
  isoCurrencyCode: string | null;
  personalFinanceCategory?: PlaidPersonalFinanceCategory;
}

export interface PlaidPersonalFinanceCategory {
  confidenceLevel: string;
  detailed: string;
  primary: string;
}

export type PlaidTransformMethod = 'transactionsByDate' | 'accountsByBalance' | 'topMerchantsBySpend' | 'yearlySpendByMonthAndCategory';

export interface PlaidDataTransformConfig extends DataTransformConfig {
  method: PlaidTransformMethod;
}

export interface PlaidItem {
  id: number;
  itemId: string;
  accessToken?: string;
  institutionId: string | null;
  institutionName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LinkTokenResponse {
  linkToken: string;
  expiration?: string;
}