export class CreateCategoryRequestDTO {
  name!: string;
  type!: string;
  limitAmount?: number | null;

  constructor(partial: Partial<CreateCategoryRequestDTO>) {
    Object.assign(this, partial);
  }
}
