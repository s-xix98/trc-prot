import { ApiProperty } from "@nestjs/swagger";
export class authLoginDto {
  @ApiProperty({ example: 'hoge@example.com', description: 'test' })
  email: string;
  @ApiProperty({ example: 'ft12345', description: 'test' })
  providerId: string;
  @ApiProperty({ example: '42', description: 'test' })
  providerName: string;
}
