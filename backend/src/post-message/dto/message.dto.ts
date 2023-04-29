import { ApiProperty } from '@nestjs/swagger';
// 今後 class validatorでバリデートする
// https://qiita.com/potato4d/items/d22a14ff6fb82d63c742
export class MessageDto {
  @ApiProperty({ example: 'test Message', description: 'test' })
  content: string;
  @ApiProperty({ example: 1, description: 'test' })
  authorId: number;
}
