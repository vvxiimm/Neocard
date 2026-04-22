import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

// Core modules
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CardsModule } from './modules/cards/cards.module';
import { DecksModule } from './modules/decks/decks.module';
import { MatchesModule } from './modules/matches/matches.module';
import { EconomyModule } from './modules/economy/economy.module';
import { ShopModule } from './modules/shop/shop.module';
import { QuestsModule } from './modules/quests/quests.module';
import { SocialModule } from './modules/social/social.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { PokerModule } from './modules/poker/poker.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Core
    DatabaseModule,
    RedisModule,

    // Features
    AuthModule,
    UsersModule,
    CardsModule,
    DecksModule,
    MatchesModule,
    EconomyModule,
    ShopModule,
    QuestsModule,
    SocialModule,
    LeaderboardModule,
    PokerModule,
    EventsModule,
  ],
})
export class AppModule {}
