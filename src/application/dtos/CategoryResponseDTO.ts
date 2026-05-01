export class CategoryResponseDTO {
  id!: string;
  userId!: string;
  name!: string;
  type!: string;
  limitAmount!: string | null;
  isDeleted: boolean = false;
  createdAt!: Date;

  constructor(data: {
    id: string;
    userId: string;
    name: string;
    type: string;
    limitAmount: bigint | null | undefined;
    isDeleted?: boolean;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.userId = data.userId;
    this.name = data.name;
    this.type = data.type;
    this.limitAmount = data.limitAmount != null ? data.limitAmount.toString() : null;
    this.isDeleted = data.isDeleted ?? false;
    this.createdAt = data.createdAt;
  }
}
