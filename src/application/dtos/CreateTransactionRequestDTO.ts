export class CreateTransactionRequestDTO {
  categoryId!: string;
  transactionName!: string;
  totalAmount!: string;
  transactionDate!: string;
  transactionTime?: string | null;
  type!: string;
  note?: string | null;
  attachment?: string | null;

  constructor(partial: Partial<CreateTransactionRequestDTO>) {
    Object.assign(this, partial);
  }
}
