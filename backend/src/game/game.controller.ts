import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

import { GameService } from './game.service';
import { MatchHistory, Rate } from './dto/Api';

@UseGuards(JwtAuthGuard)
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('ranking')
  async GetRanking(): Promise<Rate[]> {
    return this.gameService.GetRanking();
  }

  @Get('match-history')
  async GetMatchHistory(
    @Query('userId') userId: string,
  ): Promise<MatchHistory[]> {
    return this.gameService.GetMatchHistory(userId);
  }
}
