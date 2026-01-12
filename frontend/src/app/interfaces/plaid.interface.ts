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
