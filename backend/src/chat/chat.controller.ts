import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatRoom } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserInfo } from '../user/types/userInfo';

import { ChatService } from './chat.service';
import { UpdateRoomMemberRoleDto } from './dto/Channel.dto';

@UseGuards(JwtAuthGuard)
@Controller('chat')
@ApiTags('/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms')
  @ApiOperation({ summary: 'getChannels' })
  async getAllChannels(): Promise<ChatRoom[]> {
    return this.chatService.getAllChannels();
  }

  @Get('rooms/:id/history')
  async getChannelHistoryById(
    @Request() req: any,
    @Param('id') roomId: string,
  ) {
    return this.chatService.getChannelHistoryById(roomId, req.user.userId);
  }

  @Get('rooms/:id/members')
  async getRoomMembersById(
    @Request() req: any,
    @Param('id') roomId: string,
  ): Promise<UserInfo[]> {
    return this.chatService.getRoomMembersById(roomId, req.user.userId);
  }

  @Get('search')
  async search(@Query('searchWord') searchWord: string) {
    return this.chatService.search(searchWord);
  }

  @Patch('rooms/:roomId/members/:targetId/role')
  async updateRoomMemberRole(
    @Param('roomId') roomId: string,
    @Param('targetId') targetId: string,
    @Request() req: any,
    @Body() dto: UpdateRoomMemberRoleDto,
  ) {
    console.log('updateRoomMemberRole', roomId, targetId, req.user.userId, dto);

    return this.chatService.updateRoomMemberRole(
      roomId,
      targetId,
      req.user.userId,
      dto,
    );
  }
}
