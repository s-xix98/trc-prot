import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

import { Rate } from './types';
import { GameService } from './game.service';

@UseGuards(JwtAuthGuard)
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('ranking')
  async GetRanking(): Promise<Rate[]> {
    return this.gameService.GetRanking();
  }

  @Get('match-history')
  async GetMatchHistory(@Query('userId') userId: string) {
    return this.gameService.GetMatchHistory(userId);
  }
}
