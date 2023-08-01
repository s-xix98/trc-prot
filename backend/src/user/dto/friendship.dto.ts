import { IsString } from 'class-validator';
export class friendshipDto {
  @IsString()
  targetId: string;
}
