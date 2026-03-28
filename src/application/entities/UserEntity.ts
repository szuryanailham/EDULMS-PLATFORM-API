export class UserEntity {
  id!: number;
  username!: string;
  email!: string;
  password!: string;
  created_at!: Date;
  updated_at!: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
