import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Get('definitions')
  getDefinitions() {
    return this.cardsService.getCardDefinitions();
  }

  @Get('collection')
  getCollection(@CurrentUser() user: any) {
    return this.cardsService.getUserCollection(user.userId);
  }

  @Post('craft')
  craftCard(@CurrentUser() user: any, @Body() data: any) {
    return this.cardsService.craftCard(user.userId, data.cardDefinitionId);
  }

  @Post('disenchant')
  disenchantCard(@CurrentUser() user: any, @Body() data: any) {
    return this.cardsService.disenchantCard(user.userId, data.userCardId);
  }
}
