import { ApiProperty } from '@nestjs/swagger';

export class signUpDto {
  @ApiProperty({ example: 'a@a.com', description: 'test' })
  email: string;
  @ApiProperty({ example: 'nori', description: 'test' })
  nickname: string;
  @ApiProperty({ example: 'abc', description: 'test' })
  hashedPassword: string;
}

export class loginDto {
  @ApiProperty({ example: 'a@a.com', description: 'test' })
  email: string;
  @ApiProperty({ example: 'abc', description: 'test' })
  hashedPassword: string;
}
