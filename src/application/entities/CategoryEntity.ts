export class CategoryEntity {
  id!: string;
  userId!: string;
  name!: string;
  type!: string;
  limitAmount!: bigint | null;
  isDeleted: boolean = false;
  createdAt!: Date;

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}
