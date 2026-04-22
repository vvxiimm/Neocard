import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async getCardDefinitions(filters?: any) {
    return this.prisma.cardDefinition.findMany({
      where: {
        isActive: true,
        ...filters,
      },
    });
  }

  async getUserCollection(userId: string) {
    return this.prisma.userCard.findMany({
      where: { userId },
      include: { cardDefinition: true },
    });
  }

  async craftCard(userId: string, cardDefinitionId: string) {
    // Check dust, deduct, create card
    // Implementation here
    return { success: true };
  }

  async disenchantCard(userId: string, userCardId: string) {
    // Remove card, add dust
    // Implementation here
    return { success: true };
  }
}
