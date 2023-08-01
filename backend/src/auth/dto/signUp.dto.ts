import {
  IsEmail,
  IsString,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class signUpDto {
  @ApiProperty({ example: 'nori@example.com', description: 'test' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'nori', description: 'test' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  username: string;

  @ApiProperty({ example: 'norinori', description: 'test' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  hashedPassword: string;
}
