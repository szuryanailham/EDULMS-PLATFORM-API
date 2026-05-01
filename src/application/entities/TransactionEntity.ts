export class TransactionEntity {
  id!: string;
  userId!: string;
  categoryId!: string;
  transactionName!: string;
  totalAmount!: bigint;
  transactionDate!: Date;
  transactionTime!: Date | null;
  type!: string;
  note!: string | null;
  attachment!: string | null;
  createdAt!: Date;

  constructor(partial: Partial<TransactionEntity>) {
    Object.assign(this, partial);
  }
}
