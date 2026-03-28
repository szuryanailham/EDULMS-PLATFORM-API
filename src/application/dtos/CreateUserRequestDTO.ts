export class CreateUserRequestDTO {
  username!: string;
  email!: string;
  password!: string;

  constructor(partial: Partial<CreateUserRequestDTO>) {
    Object.assign(this, partial);
  }
}
