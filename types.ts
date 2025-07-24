
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
}

export interface DeletedTransaction extends Transaction {
  deletedAt: string;
}

export interface ChartData {
    name: string;
    value: number;
}