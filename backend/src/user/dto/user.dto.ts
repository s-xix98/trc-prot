import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class searchUserDto {
  searchWord: string;
}

export class UserProfileDto {
  @IsOptional()
  @IsString()
  base64Image?: string;

  @IsOptional()
  @IsString()
  @Length(3, 30)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  username?: string;
}
