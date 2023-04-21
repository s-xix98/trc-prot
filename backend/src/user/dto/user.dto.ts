export class signUpDto {
  email: string;
  nickname: string;
  hashedPassword: string;
}

export class loginDto {
  email: string;
  hashedPassword: string;
}
