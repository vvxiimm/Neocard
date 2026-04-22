import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { createHmac } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateTelegramWebApp(initData: string): Promise<any> {
    const botToken = this.configService.get('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN not configured');
    }

    // Parse initData
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');

    // Create data check string
    const dataCheckArr: string[] = [];
    params.forEach((value, key) => {
      dataCheckArr.push(`${key}=${value}`);
    });
    dataCheckArr.sort();
    const dataCheckString = dataCheckArr.join('\n');

    // Validate hash
    const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      throw new UnauthorizedException('Invalid Telegram data');
    }

    // Parse user data
    const userJson = params.get('user');
    if (!userJson) {
      throw new UnauthorizedException('User data not found');
    }

    const userData = JSON.parse(userJson);
    return userData;
  }

  async login(initData: string) {
    const telegramUser = await this.validateTelegramWebApp(initData);

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { telegramId: BigInt(telegramUser.id) },
      include: { profile: true },
    });

    if (!user) {
      // Create new user
      user = await this.prisma.user.create({
        data: {
          telegramId: BigInt(telegramUser.id),
          username: telegramUser.username,
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          photoUrl: telegramUser.photo_url,
          profile: {
            create: {
              level: 1,
              xp: 0,
            },
          },
        },
        include: { profile: true },
      });

      // Initialize currencies
      await this.initializeUserCurrencies(user.id);

      // Give starter cards
      await this.giveStarterCards(user.id);
    } else {
      // Update last login
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    }

    // Generate JWT
    const payload = { sub: user.id, telegramId: user.telegramId.toString() };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        telegramId: user.telegramId.toString(),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: user.photoUrl,
        profile: user.profile,
      },
    };
  }

  private async initializeUserCurrencies(userId: string) {
    const currencies = ['CREDITS', 'SHARDS', 'CHIPS', 'DUST'];

    for (const type of currencies) {
      await this.prisma.currency.create({
        data: {
          userId,
          type,
          amount: type === 'CREDITS' ? 1000 : type === 'CHIPS' ? 1000 : 0,
        },
      });
    }
  }

  private async giveStarterCards(userId: string) {
    // Get common cards for starter deck
    const commonCards = await this.prisma.cardDefinition.findMany({
      where: { rarity: 'COMMON', isActive: true },
      take: 20,
    });

    for (const card of commonCards) {
      await this.prisma.userCard.create({
        data: {
          userId,
          cardDefinitionId: card.id,
          count: 2,
          level: 1,
        },
      });
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
