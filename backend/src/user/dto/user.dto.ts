import { ApiProperty } from '@nestjs/swagger';

export class loginDto {
  @ApiProperty({ example: 'nori@example.com', description: 'test' })
  email: string;
  @ApiProperty({ example: 'norinori', description: 'test' })
  hashedPassword: string;
}

export class searchUserDto {
  searchWord: string;
}
