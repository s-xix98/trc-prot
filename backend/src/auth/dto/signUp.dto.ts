import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class signUpDto {
  @ApiProperty({ example: 'nori@example.com', description: 'test' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'nori', description: 'test' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'norinori', description: 'test' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  hashedPassword: string;
}
