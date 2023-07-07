import { IsNotEmpty } from "class-validator";

export class TwoFaDto {
  @IsNotEmpty()
  twoFaCode: string;
}
