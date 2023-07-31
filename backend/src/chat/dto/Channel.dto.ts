import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class JoinChannelDto {
  @IsString()
  chatRoomId: string;

  @IsOptional()
  @Length(3, 30)
  @IsString()
  password?: string;
}
export class CreateChannelDto {
  @IsString()
  @Length(3, 30)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  roomName: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  password?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}

export class CreateDMDto {
  @IsString()
  targetId: string;
}

export class UpdateRoomMemberRoleDto {
  @IsIn(['ADMIN', 'USER'])
  role: 'ADMIN' | 'USER';
}

export class RoomMemberRestrictionDto {
  @IsString()
  chatRoomId: string;

  @IsString()
  targetId: string;

  @IsNumber()
  @Min(1)
  duration: number;
}

export class KickRoomMemberDto {
  @IsString()
  chatRoomId: string;

  @IsString()
  targetId: string;
}

export class InviteChatRoomDto {
  @IsString()
  chatRoomId: string;

  @IsString()
  targetId: string;
}

export class AcceptChatInvitationDto {
  @IsString()
  chatRoomId: string;

  @IsString()
  inviterId: string;
}

export class LeaveRoomDto {
  @IsString()
  chatRoomId: string;
}

export class RejectChatInvitationDto {
  @IsString()
  chatRoomId: string;

  @IsString()
  inviterId: string;
}

export class UpdateChatRoomDto {
  @IsString()
  chatRoomId: string;

  @IsOptional()
  @IsString()
  @Length(3, 30)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  roomName?: string;

  @IsOptional()
  @Length(0, 30)
  password?: string | null;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
