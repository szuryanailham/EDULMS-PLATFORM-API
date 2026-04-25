export class CreateUserRequestDTO {
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;

  constructor(partial: Partial<CreateUserRequestDTO>) {
    Object.assign(this, partial);
  }
}
