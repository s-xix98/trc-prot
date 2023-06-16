import { ApiProperty } from '@nestjs/swagger';

export class signUpDto {
  @ApiProperty({ example: 'nori@example.com', description: 'test' })
  email: string;
  @ApiProperty({ example: 'nori', description: 'test' })
  username: string;
  @ApiProperty({ example: 'norinori', description: 'test' })
  hashedPassword: string;
}
