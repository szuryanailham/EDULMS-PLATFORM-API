export class UserResponseDTO {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  createdAt!: Date;

  constructor(partial: Partial<UserResponseDTO>) {
    Object.assign(this, partial);
  }
}
