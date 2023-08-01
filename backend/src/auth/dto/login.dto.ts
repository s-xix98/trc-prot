import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class loginDto {
  @ApiProperty({ example: 'nori@example.com', description: 'test' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'norinori', description: 'test' })
  @IsString()
  @IsNotEmpty()
  @Length(0, 30)
  hashedPassword: string;
}
