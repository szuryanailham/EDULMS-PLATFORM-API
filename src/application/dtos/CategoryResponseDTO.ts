export class CategoryResponseDTO {
  id!: string;
  userId!: string;
  name!: string;
  type!: string;
  limitAmount!: string | null;
  createdAt!: Date;

  constructor(data: {
    id: string;
    userId: string;
    name: string;
    type: string;
    limitAmount: bigint | null | undefined;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.userId = data.userId;
    this.name = data.name;
    this.type = data.type;
    this.limitAmount = data.limitAmount != null ? data.limitAmount.toString() : null;
    this.createdAt = data.createdAt;
  }
}
