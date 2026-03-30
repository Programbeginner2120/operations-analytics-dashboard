import { DataQueryConfig, DataTransformConfig } from "./dashboard.interface";

/**
 * Plaid-specific query config — extends the base with the institution filter
 */
export interface PlaidDataQueryConfig extends DataQueryConfig {
    institutionId?: string;
}

// Minimal Account Interface
export interface PlaidAccountBalance {
  current: number | null;
  available: number | null;
  iso_currency_code: string | null;
}

export interface PlaidAccount {
  account_id: string;
  name: string;
  type: string;
  subtype: string | null;
  mask: string | null;
  balances: PlaidAccountBalance;
}

// Minimal Transaction Interface
export interface PlaidTransaction {
  transaction_id: string;
  account_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name: string | null;
  category: string[] | null;
  pending: boolean;
  payment_channel: string;
  iso_currency_code: string | null;
}

export type PlaidTransformMethod = 'transactionsByDate' | 'accountsByBalance' | 'topMerchantsBySpend';

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