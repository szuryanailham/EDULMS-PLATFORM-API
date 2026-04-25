export class UserEntity {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
  createdAt!: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
