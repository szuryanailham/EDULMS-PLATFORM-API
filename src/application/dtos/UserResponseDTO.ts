export class UserResponseDTO {
  id!: number;
  username!: string;
  email!: string;
  createdAt!: Date;

  constructor(partial: Partial<UserResponseDTO>) {
    Object.assign(this, partial);
  }
}
