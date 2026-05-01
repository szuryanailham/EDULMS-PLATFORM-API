export class TransactionResponseDTO {
  id!: string;
  userId!: string;
  categoryId!: string;
  transactionName!: string;
  totalAmount!: string;
  transactionDate!: string;
  transactionTime!: string | null;
  type!: string;
  note!: string | null;
  attachment!: string | null;
  createdAt!: Date;

  constructor(data: {
    id: string;
    userId: string;
    categoryId: string;
    transactionName: string;
    totalAmount: bigint;
    transactionDate: Date;
    transactionTime: Date | null;
    type: string;
    note: string | null;
    attachment: string | null;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.userId = data.userId;
    this.categoryId = data.categoryId;
    this.transactionName = data.transactionName;
    this.totalAmount = data.totalAmount.toString();
    this.transactionDate = data.transactionDate.toISOString().slice(0, 10);
    this.transactionTime = data.transactionTime
      ? data.transactionTime.toISOString().slice(11, 19)
      : null;
    this.type = data.type;
    this.note = data.note;
    this.attachment = data.attachment;
    this.createdAt = data.createdAt;
  }
}
