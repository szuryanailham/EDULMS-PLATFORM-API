export interface UpdateTransactionRequestDTO {
  categoryId?: string;
  transactionName?: string;
  totalAmount?: string;
  transactionDate?: string;
  transactionTime?: string | null;
  type?: 'income' | 'expense';
  note?: string | null;
  attachment?: string | null;
}
