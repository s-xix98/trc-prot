import { IsString, Length } from 'class-validator';

export class MessageDto {
  @IsString()
  @Length(1, 1000)
  content: string;

  @IsString()
  chatRoomId: string;
}
