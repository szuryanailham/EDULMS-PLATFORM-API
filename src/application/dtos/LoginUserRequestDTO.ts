export class LoginUserRequestDTO {
  email!: string;
  password!: string;

  constructor(partial: Partial<LoginUserRequestDTO>) {
    Object.assign(this, partial);
  }
}
