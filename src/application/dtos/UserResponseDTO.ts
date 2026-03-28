export class UserResponseDTO {
  id!: number;
  username!: string;
  email!: string;
  created_at!: Date;

  constructor(partial: Partial<UserResponseDTO>) {
    Object.assign(this, partial);
  }
}
