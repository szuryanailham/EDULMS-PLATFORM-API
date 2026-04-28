export class UpdateCategoryRequestDTO {
  name?: string;
  type?: string;
  limitAmount?: number | null;

  constructor(partial: Partial<UpdateCategoryRequestDTO>) {
    Object.assign(this, partial);
  }
}
